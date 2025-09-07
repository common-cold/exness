import type { Asset, PriceUpdate } from "@repo/types/client";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { LabelImageComponent } from "./LabelImageComponent";
import { assetPricesAtom, reloadOrderTabAtom, selectedAssetAtom, selectedAssetImageAtom } from "../store/atoms";
import { useState } from "react";
import { createOrder } from "../utils/util";
import toast from "react-hot-toast";


type OrderType = "Long" | "Short";


export type PlaceOrderButtonProps = {
    type: OrderType,
    volume: number,
    margin: number,
    asset: Asset,
    changeType: (type: OrderType | null) => void,
    togglePlaceOrderBtn: (val: boolean) => void,
}

export type SellBuyButtonsProp = {
    type: OrderType,
    price: number,
    changeType: (type: OrderType | null) => void,
    togglePlaceOrderBtn: (val: boolean) => void,
}    

export type InputBoxProps = {
    label: string, 
    onChange: (val: any)=> void, 
    defaultValue: number
}



export function OrderPlaceTab() {
    const selectedAsset = useRecoilValue(selectedAssetAtom);
    const selectedAssetImage = useRecoilValue(selectedAssetImageAtom); 
    const assetPrices = useRecoilValue(assetPricesAtom);
    const selectedAssetPrice = assetPrices[selectedAsset as keyof PriceUpdate]
    const [type, setType] = useState<OrderType | null>();
    const [volume, setVolume] = useState(0.01);
    const [margin, setMargin] = useState(5);
    const [showPlaceOrerButton, setShowPlaceOrderButton] = useState(false);

    
    return <div style={{display: "flex", flexDirection: "column", gap: "13px", padding: "10px"}} className="greyBorder gridContent">
        <div style={{display: "flex", justifyContent: "flex-start"}}>
            <LabelImageComponent url={selectedAssetImage} label={selectedAsset.toUpperCase()}/>
        </div>
        <div style={{display: "flex", justifyContent: "space-around", height: "80px", gap: "5px"}}>
            <SellBuyButtons 
                type="Short" 
                price={selectedAssetPrice.sellPrice} 
                changeType={setType} 
                togglePlaceOrderBtn={setShowPlaceOrderButton}
            />
            <SellBuyButtons 
                type="Long" 
                price={selectedAssetPrice.buyPrice} 
                changeType={setType} 
                togglePlaceOrderBtn={setShowPlaceOrderButton}
            />
        </div>
        <InputBox label="Volume" onChange={setVolume} defaultValue={0.01}/>
        <InputBox label="Margin" onChange={setMargin} defaultValue={5}/>

        {
            (showPlaceOrerButton && type !=null && margin > 0 && volume > 0) &&
            <>
                <PlaceOrderButton 
                    type={type} 
                    volume={volume} 
                    margin={margin} 
                    asset={selectedAsset} 
                    changeType={setType} 
                    togglePlaceOrderBtn={setShowPlaceOrderButton}
                />
                <CancelButton onClick={setShowPlaceOrderButton}/>
            </>
        }
        
    </div>
}

function PlaceOrderButton({type, volume, margin, asset, changeType, togglePlaceOrderBtn}: PlaceOrderButtonProps) {
    const setReloadOrderTab = useSetRecoilState(reloadOrderTabAtom);
    
    async function placeOrder() {
        const response = await createOrder({
            userId: "68cb171e-a6ec-4229-8c48-8ebada3625ed",
            type: type,
            asset: asset,
            margin: margin,
            qty: volume
        });
        if (!response) {
            showErrorToast("Please try again!");
            
        } else if (response.status == 200) {
            showSuccessToast(response.data);
            setReloadOrderTab(prev => prev + 1);

        } else if (response.status === 400) {
            showErrorToast(response.data);
        } else if (response.status === 500) {
            showErrorToast("Please try again!");
        }
        changeType(null);
        togglePlaceOrderBtn(false);
    }
    
    
    return <div 
        onClick={
            async () => await placeOrder()
        }
        style={{display: "flex", height: "50px", borderRadius: "5px", backgroundColor:  type === "Long" ? "#158bf9" : "#eb483f", 
            justifyContent: "center", alignItems: "center", color: "white", fontWeight: "bold"}}>
            Confirm {type === "Long" ? "Buy" : "Sell"} {volume} lots
    </div>
}

function CancelButton({onClick}: {onClick: (val: boolean)=> void}) {
    return <div 
        onClick={() => onClick(false)}
        style={{display: "flex", height: "50px", borderRadius: "5px", backgroundColor: "#222d35", 
            justifyContent: "center", alignItems: "center", color: "white", fontWeight: "bold"}}>
            Cancel
    </div>
}


function SellBuyButtons({type, price, changeType, togglePlaceOrderBtn} : SellBuyButtonsProp) {
    return <div 
        onClick= {
           () => {
                console.log("came her");
                changeType(type);
                togglePlaceOrderBtn(true);
            }
        }
        style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            padding: "20px",
            borderRadius: "5px",
            backgroundColor: type === "Long" ? "#158bf9" : "#eb483f"}}>
            <div style={{display: "flex", flexDirection: "column", gap: "4px", alignItems: "center", color: "white", fontWeight: "bold"}}>
                <div>
                    {type === "Long" ? "Buy" : "Sell"}
                </div>
                <div>
                    {price}
                </div>
            </div>
    </div>
}

function InputBox({label, onChange, defaultValue} : InputBoxProps) {
    return <div style={{display: "flex", flexDirection: "column", gap: "5px"}}>
        <div style={{color: "white"}}>
            {label}
        </div>
        <input className="greyBorder" style={{color: "white", borderRadius: "5px", height: "35px", background: "transparent", paddingInline: "12px"}}
            onChange={(e) => onChange(e.target.value)}
            defaultValue={defaultValue}
        />
    </div>
}


function showSuccessToast(message: string) {
    toast.success(
        <div>
            {message}
        </div>,
        { 
            duration: 5000, 
            style: {
            borderRadius: "5px",
            background: "#595E63",
            color: "#fff"
        }}
    );  
}
function showErrorToast(message: string) {
    toast.error(
        <div>
            {message}
        </div>,
        { 
            duration: 5000, 
            style: {
            borderRadius: "5px",
            background: "#595E63",
            color: "#fff"
        }}
    );  
}