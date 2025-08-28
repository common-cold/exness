import dotenv from "dotenv";
import { join } from "path";
import { insertKline } from '@repo/db/client';
import type { Kline, PriceUpdate } from '@repo/types/client';
import type { ServerWebSocket } from "bun";


dotenv.config({ path: join(__dirname, "..", "..", ".env") });

const symbol = "btcusdt";
const interval = "1m";
const url = `wss://stream.binance.com:9443/ws/${symbol}@kline_${interval}`
const wss = new WebSocket(url);

// let klineArray: Kline[] = [];
let clients = new Set<ServerWebSocket<unknown | undefined>>(); 

wss.onmessage = async (event: MessageEvent) => {
    let data = JSON.parse(event.data);
    let klineObject = {
        "eventTime": data.E,
        "startTime": data.k.t,
        "event": data.e,
        "open": data.k.o,
        "high": data.k.h,
        "low": data.k.l,
        "close": data.k.c,
        "volume": data.k.v,
        "isClosed": data.k.x
    };
    console.log(klineObject);

    let priceUpdate: PriceUpdate = {
        btc: klineObject.close
    } 
    clients.forEach(async (client) => {
        client.send(JSON.stringify(priceUpdate));
    })

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


Bun.serve({
    port: 8082,
    fetch(req, server) {
        if (server.upgrade(req)) {
            return;
        } else {
            return new Response("Not a websocket");
        }
    },
    websocket: {
        open(ws) {
            clients.add(ws);   
        },
        message(ws, message) {

        }
    }
});
