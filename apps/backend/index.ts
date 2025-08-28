import {prismaClient } from "@repo/db/client";

import express from 'express';
const app = express();

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

app.listen(8080);