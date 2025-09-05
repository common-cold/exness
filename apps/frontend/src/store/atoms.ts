import { atom } from "recoil";

export const priceBarAtom = atom({
    key: "priceBarAtom",
    default: true
});

export const assetPriceAtom = atom({
    key: "assetPriceAtom",
    default: {
        btc: 0,
    }
});