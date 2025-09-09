import dotenv from "dotenv";
import { join } from "path";
import { insertKline, prismaClient } from '@repo/db/client';
import type { Kline, PriceTick, PriceUpdate } from '@repo/types/client';
import type { ServerWebSocket } from "bun";
import { CHANNEL_NAME, PRICE_DECIMAL, VOLUME_DECIMAL } from "@repo/common";
import { publishClient } from "@repo/redis";
import Bull from "bull";
import cron from "node-cron";


dotenv.config({ path: join(__dirname, "..", "..", ".env") });

const redisConfig = {
    redis: {
        port: 6379,
        host: "127.0.0.1",
        password: ""
    }
}

let priceQueue = new Bull("priceQueue", redisConfig);




//batch uploader
cron.schedule("* * * * *", async () => {
    console.log("came inside cron1");
    const jobs = await priceQueue.getJobs(["waiting"]);
    for (const job of jobs) {
        let priceTick: PriceTick = job.data;
        try {
            await prismaClient.price_ticker.create({
                data: {
                    ts: Number(priceTick.time),
                    price: Math.round(Number(parseFloat(priceTick.price).toFixed(2)) * PRICE_DECIMAL),
                    volume: Math.round(Number(parseFloat(priceTick.volume).toFixed(5)) * VOLUME_DECIMAL)
                }
            });
        } catch (e) {

        }
        await job.moveToCompleted("done", true);
    }
});

//populate kline_1m hypertable
cron.schedule("*/2 * * * *", async () => {
    console.log("came inside cron2");
    let open;
    let high;
    let low;
    let close;
    let volume = 0;
    let currTimestamp = new Date().getTime();
    try {
        let ticks = await prismaClient.price_ticker.findMany({
            where: {
                ts: {
                    lt: currTimestamp,
                    gte: currTimestamp - 60 * 1000
                }
            },
            orderBy: {
                ts: "asc"
            }
        });

        if (ticks.length == 0) {
            return;
        }

        open = ticks[0].price;
        close = ticks[ticks.length - 1].price;
        high = open;
        low = open;
        for (const tick of ticks) {
            high = Math.max(high, tick.price);
            low = Math.min(low, tick.price);
            volume = volume + tick.volume
        }

        console.log({
            currTimestamp,
            open,
            high,
            low,
            close,
            volume
        });
    } catch (e) {
        return;
    }
});


// const symbol = "btcusdt";
// const interval = "1m";
// const url = `wss://stream.binance.com:9443/ws/${symbol}@kline_${interval}`
const symbol = "btcusdt";
const url = `wss://stream.binance.com:9443/ws/${symbol}@trade`
const wss = new WebSocket(url);

wss.onmessage = async (event: MessageEvent) => {
    const priceObject = JSON.parse(event.data);
    const priceTick: PriceTick = {
        time: priceObject.E,
        price: priceObject.p,
        volume: priceObject.q
    } 
    priceQueue.add(priceTick);
}



// wss.onmessage = async (event: MessageEvent) => {
//     let data = JSON.parse(event.data);
//     let klineObject = {
//         "eventTime": data.E,
//         "startTime": data.k.t,
//         "event": data.e,
//         "open": Math.round(Number(parseFloat(data.k.o).toFixed(2)) * PRICE_DECIMAL),
//         "high": Math.round(Number(parseFloat(data.k.h).toFixed(2)) * PRICE_DECIMAL),
//         "low": Math.round(Number(parseFloat(data.k.l).toFixed(2)) * PRICE_DECIMAL),
//         "close": Math.round(Number(parseFloat(data.k.c).toFixed(2)) * PRICE_DECIMAL),
//         "volume": Math.round(Number(parseFloat(data.k.v).toFixed(5)) * VOLUME_DECIMAL),
//         "isClosed": data.k.x
//     };
//     console.log(klineObject);
//     let priceUpdate: PriceUpdate = {
//         btc: calculatePrice(klineObject.close, 0.01)
//     } 

//     await publish(priceUpdate);

//     if (klineObject.isClosed) {
//         let klineDbEntity: Kline = {
//             ts: BigInt(Math.floor(klineObject.startTime/1000)),
//             open: klineObject.open,
//             high: klineObject.high,
//             low: klineObject.low,
//             close: klineObject.close,
//             volume: klineObject.volume
//         }
//         await insertKline(klineDbEntity);
//     }
// }

// wss.onopen = async () => {
//     console.log("Established Price Poller <> Binance socket");
// }


// async function publish(priceUpdate: PriceUpdate) {
//     await publishClient.publish(CHANNEL_NAME, JSON.stringify(priceUpdate));
// }


// function calculatePrice(price: number, percentage: number) {
//     let difference = price * percentage / 100;
//     return {
//         buyPrice: Math.round(price + difference)/PRICE_DECIMAL,
//         sellPrice: Math.round(price - difference)/PRICE_DECIMAL
//     }
// }
