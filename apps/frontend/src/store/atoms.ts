import { atom } from "recoil";
import btc from "../assets/btc.png";
import type { Asset, ClosedOrders, OpenOrders, PriceUpdate } from "@repo/types/client";
 
export const priceBarAtom = atom({
    key: "priceBarAtom",
    default: true
});

export const assetPricesAtom = atom({
    key: "assetPriceAtom",
    default: {
        btc: {
            buyPrice: 0,
            sellPrice: 0
        }
    }
});

export const selectedAssetAtom = atom<Asset>({
    key: "selectedAssetAtom",
    default: "btc"
});

export const selectedAssetImageAtom = atom({
    key: "selectedAssetImageAtom",
    default: btc
});

export const reloadOrderTabAtom = atom({
    key: "reloadOrderTabAtom",
    default: 0
});

export const closedOrdersAtom = atom<ClosedOrders[] | null>({
    key: "closedOrdersAtom",
    default: []
});

export const openOrdersAtom = atom<OpenOrders[] | null>({
    key: "openOrdersAtom",
    default: []
});