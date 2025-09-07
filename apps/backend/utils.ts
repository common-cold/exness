import { BTC_DECIMAL, PRICE_DECIMAL } from "@repo/common";

export function calculateProfitAndLoss(entryPriceRaw: bigint, exitPriceRaw: bigint, qtyRaw: bigint) {
    let entryPrice = Number(entryPriceRaw) / PRICE_DECIMAL;
    let exitPrice = Number(exitPriceRaw) / PRICE_DECIMAL;
    let qty = Number(qtyRaw) / BTC_DECIMAL;
    let res = Number(((entryPrice - exitPrice) * qty).toFixed(2)) * PRICE_DECIMAL;
    return BigInt(res);
}
