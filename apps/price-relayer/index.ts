import { CHANNEL_NAME } from "@repo/common";
import { subscriberClient } from "@repo/redis";
import type { ServerWebSocket } from "bun";

let clients = new Set<ServerWebSocket<unknown | undefined>>(); 

// const upstream = new WebSocket("ws://localhost:8082");
// upstream.onmessage = async (event: MessageEvent) => {
//     console.log(event);
//     clients.forEach(async (client) => {
//         client.send(event.data);
//     });
// }

// upstream.onopen = () => {
//     console.log("Established Price Relayer <> Price Poller socket");
// }

await subscriberClient.subscribe(CHANNEL_NAME, async (data) => {
    console.log(data);
    clients.forEach(async (client) => {
        client.send(data);
    });
});


Bun.serve({
    port: 8081,
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