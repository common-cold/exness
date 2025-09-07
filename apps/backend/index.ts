import {prismaClient } from "@repo/db/client";
import express from 'express';
import cors from 'cors';
import type { CreateOrderBody, PriceUpdate, Asset, GetOrderBody, OpenOrders, ClosedOrders, CloseOrderBody } from "@repo/types/client";
import { order_type, type kline_15m, type kline_1m, type kline_30m } from "../../packages/db/generated/prisma";
import { password } from "bun";
import { subscriberClient } from "@repo/redis";
import { BTC_DECIMAL, CHANNEL_NAME, PRICE_DECIMAL } from "@repo/common";
import { calculateProfitAndLoss } from "./utils";


let currentSellPrice: number;
let currentBuyPrice: number;
await subscriberClient.subscribe(CHANNEL_NAME, async (data) => {
    let json: PriceUpdate = JSON.parse(data);
    const priceUpdate = json;
    currentSellPrice = priceUpdate.btc.sellPrice;
    currentBuyPrice = priceUpdate.btc.buyPrice;
});


const app = express();

app.use(cors());
app.use(express.json());

app.post("/signup", async(req, res) => {
    let body = req.body;
    
    try {
        const userDb = await prismaClient.users.create({
            data: {
                username: body.username,
                password: body.password,
                free_balance: 1000 * PRICE_DECIMAL
            }
        });
        return res.status(200).json(userDb.id);
    } catch (e) {
        return res.status(500).json({
            message: e
        });
    }
});

app.get("/candle/:time", async (req, res) => {
    const time = req.params.time;
    let candles;
    if (time === "1m") {
        candles =  await prismaClient.kline_1m.findMany();
    } else if (time === "15m") {
        candles =  await prismaClient.kline_15m.findMany();
    } else if (time === "30m") {
        candles =  await prismaClient.kline_30m.findMany();
    } else {
        res.json("Not supported");
    }
    res.json(candles);
});

app.get("/candles", async(req, res) => {
    let time = req.query.time;
    let startTime = Number(req.query.startTime);
    let endTime = Number(req.query.endTime);
    let candles;

    if (isNaN(startTime) || isNaN(endTime)) {
        return res.status(400).json("Invalid params");
    }

    let startDate = new Date(startTime * 1000);
    let endDate = new Date(endTime * 1000);
    if (time === "1m") {
        candles = await prismaClient.kline_1m.findMany({
            where: {
                ts: {
                    gte: startDate,
                    lte: endDate
                }
            },
            orderBy: {
                ts: 'asc'
            }
        });
        return res.status(200).json(candles);
    } else if (time === "15m") {
        candles = await prismaClient.kline_15m.findMany({
            where: {
                bucket: {
                    gte: startDate,
                    lte: endDate
                }
            },
            orderBy: {
                bucket: 'asc'
            }
        });
        return res.status(200).json(candles);
    } else if (time === "30m") {
        candles = await prismaClient.kline_30m.findMany({
            where: {
                bucket: {
                    gte: startDate,
                    lte: endDate
                }
            },
            orderBy: {
                bucket: 'asc'
            }
        });
        return res.status(200).json(candles);
    } else {
        return res.status(400).json("Invalid time");
    }
});

app.post("/create/order", async (req, res) => {
    const body: CreateOrderBody = req.body;
    let userId = body.userId;
    let asset = body.asset;
    let type = body.type;
    let margin = body.margin;
    let qty = body.qty;

    let rawQty;
    let rawMargin = BigInt(margin * PRICE_DECIMAL);

    
    if (asset === "btc") {
        rawQty = BigInt(qty * BTC_DECIMAL); 
    }


    try {
        const userDb = await prismaClient.users.findFirst({
            where: {
                id: userId
            }
        });

        
        //user checks
        if (!userDb) {
            return res.status(400).json("User Id does not exist");
        }

        if (userDb.free_balance < rawMargin) {
            return res.status(400).json("Insufficient Balance");
        }

        //ad dopen order
        await prismaClient.open_orders.create({
            data: {
                user_id: userId,
                type: type,
                asset: asset,
                margin: rawMargin,
                qty: rawQty!,
                entry_price: type === order_type.Long ? BigInt(currentBuyPrice*PRICE_DECIMAL) : BigInt(currentSellPrice*PRICE_DECIMAL),
                entry_time: new Date().getTime()
            }
        });

        //lock user's balance
        await prismaClient.users.update({
            where: {
                id: userDb.id
            },
            data: {
                free_balance: userDb.free_balance -= rawMargin,
                locked_balance: userDb.locked_balance += rawMargin
            }
        });

        return res.status(200).json("Order Placed Successfully");
    } catch (e) {
        return res.status(500).json({
            message: e
        });
    }
});

app.post("/user/order", async (req, res) => {
    const body: GetOrderBody = req.body;
    const userId = body.userId;

    try {
        const userDb = await prismaClient.users.findFirst({
            where: {
                id: userId
            }
        });

        
        //user checks
        if (!userDb) {
            return res.status(400).json("User Id does not exist");
        }

        const closedOrders = await prismaClient.closed_orders.findMany({
            where: {
                user_id: userId
            },
            orderBy: {
                exit_time: "desc"
            }
        });

        const typeSafeClosedOrders = closedOrders.map(order => {
            return {
                id: order.id,
                type: order.type,
                asset: order.asset,
                margin: Number(order.margin)/PRICE_DECIMAL,
                qty: Number(order.qty)/BTC_DECIMAL,
                entry_price: Number(order.entry_price)/PRICE_DECIMAL,
                exit_price: Number(order.exit_price)/PRICE_DECIMAL,
                entry_time: Number(order.entry_time),
                exit_time: Number(order.exit_time),
                p_l: Number(order.p_l)/PRICE_DECIMAL,
                userId: order.user_id
            } as ClosedOrders
        });

        return res.status(200).json(typeSafeClosedOrders);
    } catch (e) {
        return res.status(500).json({
            message: e
        });
    }
});

app.post("/open-order", async (req, res) => {
    const body: GetOrderBody = req.body;
    const userId = body.userId;

    try {
        const userDb = await prismaClient.users.findFirst({
            where: {
                id: userId
            }
        });

        
        //user checks
        if (!userDb) {
            return res.status(400).json("User Id does not exist");
        }

        const openOrders = await prismaClient.open_orders.findMany({
            where: {
                user_id: userId
            },
            orderBy: {
                entry_time: "desc"
            }
        });

        const typeSafeOpenOrders = openOrders.map(order => {
            return {
                id: order.id,
                type: order.type,
                asset: order.asset,
                margin: Number(order.margin)/PRICE_DECIMAL,
                qty: Number(order.qty)/BTC_DECIMAL,
                entry_price: Number(order.entry_price)/PRICE_DECIMAL,
                entry_time: Number(order.entry_time),
                userId: order.user_id
            } as OpenOrders
        });
        return res.status(200).json(typeSafeOpenOrders);
    } catch (e) {
        console.log("Error: " + e);
        return res.status(500).json({
            message: e
        });
    }
});

app.post("/close/order", async (req, res) => {
    const body: CloseOrderBody = req.body;
    const userId = body.userId;
    const orderId = body.orderId;

    let userDb = await prismaClient.users.findFirst({
        where: {
            id: userId
        }
    });

    if (!userDb) {
        return res.status(400).json("User Id does not exist");
    }

    let openOrderDb = await prismaClient.open_orders.findFirst({
        where: {
            id: orderId,

        }
    });

    if (!openOrderDb) {
        return res.status(400).json("Order Id does not exist");
    }

    if (openOrderDb.user_id != userId) {
        return res.status(400).json("Open Order does not belongs to user");
    }

    const exitPrice = openOrderDb.type === "Long" ? BigInt(currentBuyPrice * PRICE_DECIMAL) : BigInt(currentSellPrice * PRICE_DECIMAL);
    const profitOrLoss = calculateProfitAndLoss(openOrderDb.entry_price, exitPrice, openOrderDb.qty);

    await prismaClient.closed_orders.create({
        data: {
            type: openOrderDb.type,
            asset: openOrderDb.asset,
            margin: openOrderDb.margin,
            qty: openOrderDb.qty,
            entry_price: openOrderDb.entry_price,
            exit_price: exitPrice,
            entry_time: openOrderDb.entry_time,
            exit_time: new Date().getTime(),
            p_l: profitOrLoss,
            user_id: userId
        }
    });

    await prismaClient.open_orders.delete({
        where: {
            id: orderId
        }
    });

    await prismaClient.users.update({
        where: {
            id: userId
        },
        data: {
            locked_balance: {
                increment: profitOrLoss
            }
        }
    });
    
    return res.status(200).json("Order Closed Successfully!");

});



app.listen(8080);
