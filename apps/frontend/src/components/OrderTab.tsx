import { useState, useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { assetPricesAtom, closedOrdersAtom, openOrdersAtom, reloadOrderTabAtom } from "../store/atoms";
import { closeUserOrder, getUserOrders } from "../utils/util";
import type { closed_orders, open_orders } from "../../../../packages/db/generated/prisma";
import type { ClosedOrders, OpenOrders, PriceUpdate } from "@repo/types/client";
import { LabelImageComponent } from "./LabelImageComponent";
import btc from "../assets/btc.png";
import { BTC_DECIMAL, PRICE_DECIMAL } from "@repo/common";
import { usePrev } from "../hooks/usePrev";
import toast from "react-hot-toast";


type TabComponentProps = {
    tab: number, 
    setTab: (index: number) => void, 
    index: number, 
    label: string
}


const openOrderHeaders = [
    "Symbol", "Type", "Volume", "Open Price", "Current Price", "Open Time", "P/L, USD"
];

const closedOrderHeaders = [
    "Symbol", "Type", "Volume", "Open Price", "Close Price", "Open Time", "Close Time", "P/L, USD"
]

export function OrderTab() {
    const [tab, setTab] = useState(0);
    const [closedOrders, setClosedOrders] = useRecoilState(closedOrdersAtom);
    const [openOrders, setOpenOrders] = useRecoilState(openOrdersAtom);
    const reloadOrderTab = useRecoilValue(reloadOrderTabAtom);

    useEffect(()=> {
        async function loadUserOrders(userId: string) {
            let closedOrders: ClosedOrders[] = await getUserOrders("Closed", userId);
            if (!closedOrders || closedOrders.length > 0) {
                setClosedOrders(closedOrders);
            } 
            let openOrders: OpenOrders[] = await getUserOrders("Open", userId);
            if (!openOrders || openOrders.length > 0) {
                setOpenOrders(openOrders);
            }
        }

        loadUserOrders("68cb171e-a6ec-4229-8c48-8ebada3625ed");
    }, [reloadOrderTab]);


    
    return <div style={{display: "flex", flexDirection: "column", width: "100%", flex: "0.5"}} className="greyBorder">
        <div style={{height: "100%", width: "100%", overflowY: "hidden"}}>
            <div style={{
                    display: "flex", 
                    justifyContent: "flex-start", 
                    gap: "20px", 
                    padding: "5 3 5 0", 
                    borderBottom: "solid 2px #3f474b",
                }}>
                    <TabComponent  tab={tab} setTab={setTab} index={0} label={"Open"}/>
                    <TabComponent  tab={tab} setTab={setTab} index={1} label={"Close"}/>
                </div>
                <div style={{
                    overflowY: "hidden",
                    whiteSpace: "nowrap",
                    border: "1px solid black"
                }}>
                    {
                        <table style={{borderCollapse: "collapse", width: "100%"}}>
                            <thead>
                                <tr>
                                    {
                                        tab === 0 ?
                                        openOrderHeaders.map((value, i) => 
                                            <th key={i} style={{padding: "8px", textAlign: "center", color: "#939586"}}>{value}</th>
                                        )
                                        :
                                        closedOrderHeaders.map((value, i) => 
                                            <th key={i} style={{padding: "8px", textAlign: "center", color: "#939586"}}>{value}</th>
                                        )
                                    }
                                </tr>
                            </thead>
                            <TableBodyComponent rows={tab === 0 ? openOrders : closedOrders} tab={tab}/>
                        </table>
                    }
                </div>
            </div>  
        </div>
}


function TabComponent({tab, setTab, index, label} : TabComponentProps) {
    return <div style={{color: "white", fontWeight: tab === index ? "bolder" : "normal", paddingInline: "10px", paddingBlock: "3px"}} 
        onClick={() => {
            setTab(index);
    }}>
        {label}
        {
            tab === index 
            &&
            <div style={{width: "100%", height: "3px", backgroundColor: "white", marginTop: "5px"}}/>
        }
        
    </div>
}


function TableBodyComponent({rows, tab}: {rows: OpenOrders[] | ClosedOrders[] | null, tab: number}) {
    return <tbody >
        {
            rows &&
            rows.map((row, index) => {
                return <tr key={index}>
                    {
                        tab === 0 
                        ?
                        <OpenOrderRow row={row} />
                        :
                        <OpenOrderRow row={row} />
                    }
                </tr>
            })
        }
    </tbody>
}


function OpenOrderRow({row}: {row: OpenOrders | ClosedOrders}) {
    const assetPrices = useRecoilValue(assetPricesAtom);
    const setOpenOrders= useSetRecoilState(openOrdersAtom);
    const setReloadOrderTab = useSetRecoilState(reloadOrderTabAtom);

    const assetPrice = assetPrices[row.asset as keyof PriceUpdate];
    const entryTime = new Date(row.entry_time).toUTCString();
    let currentPrice;
    if (row.type === "Long") {
        currentPrice = assetPrice.buyPrice;
    } else {
        currentPrice = assetPrice.sellPrice;
    }
    let p_l = Number(((row.entry_price - currentPrice) * row.qty).toFixed(2));

    async function closeOrder() {
        console.log("reached");
        const response = await closeUserOrder({
            userId: "68cb171e-a6ec-4229-8c48-8ebada3625ed",
            orderId: row.id
        });
        if (!response) {
            showErrorToast("Please try again!");
            
        } else if (response.status == 200) {
            showSuccessToast(response.data);
            setOpenOrders(prev => prev!.filter((order) => order.id != row.id));
            setReloadOrderTab(prev => prev + 1);

        } else if (response.status === 400) {
            showErrorToast(response.data);
        } else if (response.status === 500) {
            showErrorToast("Please try again!");
        }
    }


    return <>
        <td style={{padding: "8px", textAlign: "center", color: "white"}}>
            <LabelImageComponent url={btc} label={row.asset.toUpperCase()} />
        </td>
        <td style={{padding: "8px", textAlign: "center", color: "white"}}>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", gap: "2px"}}>
                <div style={{borderRadius: "50%", backgroundColor: row.type === "Long" ? "#158bf9" : "#eb483f", width: "7px", height: "7px"}}/>
                {row.type === "Long" ? "Buy" : "Sell"}
            </div>
        </td>
        <CellComponent value={row.qty} />
        <CellComponent value={row.entry_price} />
        {
            ("exit_price" in row) 
            ?
            <CellComponent value={row.exit_price} /> 
            :
            <CellComponent value={currentPrice} />
        }
        <CellComponent value={entryTime} />
        {
            ("exit_time" in row) &&
            <CellComponent value={row.exit_time} /> 
        }
        {
            ("exit_price" in row) 
            ?
            <td  style={{padding: "8px", textAlign: "center", color: row.p_l > 0 ? "#46cd7c" : "#eb483f", fontWeight: "bold"}}>
                {row.p_l}
            </td>
            :
            <td  style={{padding: "8px", textAlign: "center", color: p_l > 0 ? "#46cd7c" : "#eb483f", fontWeight: "bold"}}>
                {p_l}
            </td>
        }
        
        {
           !("exit_time" in row) &&
           <>
                <td style={{padding: "8x", textAlign: "center", color: "white"}}>
                    <div 
                        onClick={
                            async ()=> await closeOrder()
                        }
                        style={{width: "20px", height: "20px"}}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{height: "100%", width: "100%"}}>
                                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" />
                            </svg>
                    </div>
                </td>
           </>
            
            
        }
    </>
}



function CellComponent({value}: {value: any}) {
    return <td style={{padding: "8px", textAlign: "center", color: "white"}}>{value}</td>
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
