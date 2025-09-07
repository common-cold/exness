import type { Asset, PriceUpdate } from "@repo/types/client";
import btc from "../assets/btc.png";
import { usePrev } from "../hooks/usePrev";
import { useSetRecoilState } from "recoil";
import { selectedAssetAtom, selectedAssetImageAtom } from "../store/atoms";
import { LabelImageComponent } from "./LabelImageComponent";

export function Pricebar({assetPrices}: {assetPrices: PriceUpdate}) {
    const assetNames = Object.keys(assetPrices);
    return <div className="greyBorder gridContent">
        <div style={{display: "flex", flexDirection: "column"}}>
            <Header/>
            {
                assetNames.map((assetName, index) => {
                    if (index == 0) {
                        return <PriceRow key={index} firstRow={true} price={assetPrices.btc} assetName={assetName as Asset}/>
                    } 
                    return <PriceRow key={index} price={assetPrices.btc} assetName={assetName as Asset}/>
                })
            }
        </div>
    </div>
}

function Header() {
    return <div style={{padding: "4px", display: "grid", gridTemplateColumns: "4fr 8fr"}}>
        <div style={{color: "#939586"}}>
            Symbol
        </div>
        <div style={{display: "grid", gridTemplateColumns: "6fr 6fr", color: "#939586", gap: "8px"}}>
            <div>
                Bid
            </div>
            <div>
                Ask
            </div>
        </div>
    </div>
}

function PriceRow({firstRow, price, assetName}: {firstRow?: boolean, price: {buyPrice: number, sellPrice: number}, assetName: Asset}) {
    const setSelectedAsset = useSetRecoilState(selectedAssetAtom);
    const setSelectedAssetImage = useSetRecoilState(selectedAssetImageAtom);
    const prevBuyPrice = usePrev(price.buyPrice);
    const prevSellPrice = usePrev(price.sellPrice);
    
    return <div 
        onClick={() => {
            setSelectedAsset(assetName)
            setSelectedAssetImage(btc)
        }}
        style={{display: "grid", gridTemplateColumns: "4fr 8fr", borderBottom: "2px solid #3f474b", 
            borderTop: firstRow ? "2px solid #3f474b": "0px", borderColor: "#3f474b"}}>
            <div style={{borderRight: "2px solid #3f474b", borderColor: "#3f474b"}}>
                <LabelImageComponent url={btc} label={assetName.toUpperCase()}/>
            </div> 
            <div style={{display: "grid", gridTemplateColumns: "6fr 6fr", gap: "2px", padding: "5px"}}>
                <PriceBox price={price.buyPrice} hasIncreased={price.buyPrice > prevBuyPrice}/>
                <PriceBox price={price.sellPrice} hasIncreased={price.sellPrice > prevSellPrice}/>
            </div>
    </div>
}

function PriceBox({price, hasIncreased}: {price: number, hasIncreased: boolean}) {
    return <div style={{alignItems: "center", alignContent: "center", padding: "3px", height: "15px", width: "100px", overflow: "hidden", backgroundColor: hasIncreased ? "#46cd7c" : "#eb483f", transition: "0.3s ease"}}>
        {price}
    </div>
}


