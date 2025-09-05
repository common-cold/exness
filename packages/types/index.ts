import type { order_type } from "../db/generated/prisma"

export type Kline = {
    ts: bigint | string,
    open: bigint,
    high: bigint,
    low: bigint,
    close: bigint,
    volume: bigint,
}

//used only for transporting
export type PriceUpdate = {
    btc: string
}

//this is actually used
export type PriceUpdateBigInt = {
    btc: bigint
}

export type CreateOrderBody = {
    userId: string,
    asset: string,
    type: order_type,
    margin: bigint,
    qty: bigint
}

