import type { order_type } from "../db/generated/prisma"


export type Asset = "btc";

export type Kline = {
    ts: bigint | string,
    open: number,
    high: number,
    low: number,
    close: number,
    volume: number,
}


export type PriceUpdate = {
    btc: {
        buyPrice: number,
        sellPrice: number,
    },
}


export type CreateOrderBody = {
    userId: string,
    asset: Asset,
    type: order_type,
    margin: number,
    qty: number
}


export type GetOrderBody = {
    userId: string
}

export type ClosedOrders = {
    id: string,    
    type: order_type,
    asset: string,
    margin: number,
    qty: number,
    entry_price: number,
    exit_price: number,
    entry_time: number,
    exit_time: number,
    p_l: number,
    userId: string
}

export type OpenOrders = {  
    id: string,
    type: order_type,
    asset: string,
    margin: number,
    qty: number,
    entry_price: number,
    entry_time: number,
    userId: string
}

export type CloseOrderBody = {
    userId: string,
    orderId: string
}

export type PriceTick = {
    time: number,
    price: string,
    volume: string
}
