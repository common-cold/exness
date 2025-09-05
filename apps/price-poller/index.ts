import dotenv from "dotenv";
import { join } from "path";
import { insertKline, prismaClient } from '@repo/db/client';
import type { Kline, PriceUpdate } from '@repo/types/client';
import type { ServerWebSocket } from "bun";
import { CHANNEL_NAME, PRICE_DECIMAL, VOLUME_DECIMAL } from "@repo/common";
import { publishClient } from "@repo/redis";


dotenv.config({ path: join(__dirname, "..", "..", ".env") });

const symbol = "btcusdt";
const interval = "1m";
const url = `wss://stream.binance.com:9443/ws/${symbol}@kline_${interval}`
// const symbol = "btcusdt";
// const url = `wss://stream.binance.com:9443/ws/${symbol}@trade`
const wss = new WebSocket(url);


let clients = new Set<ServerWebSocket<unknown | undefined>>(); 

wss.onmessage = async (event: MessageEvent) => {
    console.log(JSON.parse(event.data));
}

wss.onmessage = async (event: MessageEvent) => {
    let data = JSON.parse(event.data);
    let klineObject = {
        "eventTime": data.E,
        "startTime": data.k.t,
        "event": data.e,
        "open": BigInt(Math.round(Number(parseFloat(data.k.o).toFixed(2)) * PRICE_DECIMAL)),
        "high": BigInt(Math.round(Number(parseFloat(data.k.h).toFixed(2)) * PRICE_DECIMAL)),
        "low": BigInt(Math.round(Number(parseFloat(data.k.l).toFixed(2)) * PRICE_DECIMAL)),
        "close": BigInt(Math.round(Number(parseFloat(data.k.c).toFixed(2)) * PRICE_DECIMAL)),
        "volume": BigInt(Math.round(Number(parseFloat(data.k.v).toFixed(5)) * VOLUME_DECIMAL)),
        "isClosed": data.k.x
    };
    console.log(klineObject);
    let priceUpdate: PriceUpdate = {
        btc: klineObject.close.toString()
    } 
    // clients.forEach(async (client) => {
    //     client.send(JSON.stringify(priceUpdate));
    // })
    await publish(priceUpdate);

    if (klineObject.isClosed) {
        let klineDbEntity: Kline = {
            ts: BigInt(Math.floor(klineObject.startTime/1000)),
            open: klineObject.open,
            high: klineObject.high,
            low: klineObject.low,
            close: klineObject.close,
            volume: klineObject.volume
        }
        await insertKline(klineDbEntity);
    }
}

wss.onopen = async () => {
    console.log("Established Price Poller <> Binance socket");
}


// Bun.serve({
//     port: 8082,
//     fetch(req, server) {
//         if (server.upgrade(req)) {
//             return;
//         } else {
//             return new Response("Not a websocket");
//         }
//     },
//     websocket: {
//         open(ws) {
//             clients.add(ws);   
//         },
//         message(ws, message) {

//         }
//     }
// });

async function publish(priceUpdate: PriceUpdate) {
    await publishClient.publish(CHANNEL_NAME, JSON.stringify(priceUpdate));
}
