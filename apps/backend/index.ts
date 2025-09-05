import {prismaClient } from "@repo/db/client";
import express from 'express';
import cors from 'cors';
import type { CreateOrderBody, PriceUpdate } from "@repo/types/client";
import { order_type } from "../../packages/db/generated/prisma";
import { password } from "bun";
import { subscriberClient } from "@repo/redis";
import { CHANNEL_NAME, convertPriceUpdate } from "@repo/common";


let currentPrice: bigint;
await subscriberClient.subscribe(CHANNEL_NAME, async (data) => {
    let json: PriceUpdate = JSON.parse(data);
    const priceUpdate = convertPriceUpdate(json);
    currentPrice = priceUpdate.btc;
});


const app = express();

app.use(cors());
app.use(express.json());

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

    console.log("is safe: " +Number.isSafeInteger(startTime));
    console.log(startTime);
    console.log("is Nan: " + isNaN(startTime));
    console.log("is Nan: " + isNaN(endTime));
    if (isNaN(startTime) || isNaN(endTime)) {
        console.log("came insdie");
        return res.status(400).json("Invalid params");
    }

    let startDate = new Date(startTime * 1000);
    let endDate = new Date(endTime * 1000);
    if (time === "1m") {
        console.log("came here");
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

        if (userDb.free_balance < margin) {
            return res.status(400).json("Insufficient Balance");
        }

        //ad dopen order
        await prismaClient.open_orders.create({
            data: {
                user_id: userId,
                type: type,
                asset: asset,
                entry_price: currentPrice,
                margin: margin,
                qty: qty,
            }
        });

        //lock user's balance
        await prismaClient.users.update({
            where: {
                id: userDb.id
            },
            data: {
                free_balance: userDb.free_balance -= margin,
                locked_balance: userDb.locked_balance += margin
            }
        });

        return res.status(200).json("Order Placed Successfully");
    } catch (e) {
        return res.status(500).json({
            message: e
        });
    }
});

app.post("/signup", async(req, res) => {
    let body = req.body;
    
    try {
        const userDb = await prismaClient.users.create({
            data: {
                username: body.username,
                password: body.password
            }
        });
        return res.status(200).json(userDb.id);
    } catch (e) {
        return res.status(500).json({
            message: e
        });
    }
});

app.listen(8080);