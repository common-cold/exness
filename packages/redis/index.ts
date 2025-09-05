import { createClient } from "redis";

export const publishClient = await createClient()
    .on("error", (err) => 
        console.log("Could not connect Publisher Client", err)
    )
    .on("connect", () => {
        "Publisher Client Connected"
    })
.connect();

export const subscriberClient = await createClient()
    .on("error", (err) => 
        console.log("Could not connect Subscriber Client", err)
    )
    .on("connect", () => {
        "Subscriber Client Connected"
    })
.connect();
