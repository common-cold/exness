import type { PriceUpdate, PriceUpdateBigInt } from "@repo/types/client";

export const PRICE_DECIMAL = 100;

export const VOLUME_DECIMAL = 100000;

export const CHANNEL_NAME = "PRICE_UPDATE";

export function convertPriceUpdate(data: PriceUpdate) {
    let result: PriceUpdateBigInt = {
        btc: BigInt(data.btc)
    } 
    return result;
}