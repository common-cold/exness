export type Kline = {
    ts: BigInt | string,
    open: number,
    high: number,
    low: number,
    close: number,
    volume: number,
}

export type PriceUpdate = {
    btc: number
}