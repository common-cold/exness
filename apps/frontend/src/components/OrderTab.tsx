import { useState } from "react";


type CellComponentProps = {
    cellIndex: number, 
    content: string|number
}

type TabComponentProps = {
    tab: number, 
    setTab: (index: number) => void, 
    index: number, 
    label: string
}

type OrderRowProps = {
    btc: string,
    type: string,
    voulume: number,
    openPrice: number,
    x: number,
    y: number,
    z: number,
    c: number,
    d: number,
    closePrice: number,
    tp: string,
    sl: string,
    position: number,
    openTime: string,
    closeTime: string,
    swap: number,
    pnl: number
} 

const data = [
    {
        btc: "BTC",
        type: "Buy",
        voulume: 0.01,
        openPrice: 109083.90,
        x: 109083.90,
        y: 109083.90,
        z: 109083.90,
        c: 109083.90,
        d:109083.90,
        closePrice: 109083.90,
        tp: "-",
        sl: "-",
        position: 2385991698,
        openTime: "Aug 31, 6:36:41 PM",
        closeTime: "Aug 31, 6:36:41 PM",
        swap: 0,
        pnl: -0.13
    },
    {
        btc: "BTC",
        type: "Buy",
        voulume: 0.01,
        openPrice: 109083.90,
        x: 109083.90,
        y: 109083.90,
        z: 109083.90,
        c: 109083.90,
        d:109083.90,
        closePrice: 109083.90,
        tp: "-",
        sl: "-",
        position: 2385991698,
        openTime: "Aug 31, 6:36:41 PM",
        closeTime: "Aug 31, 6:36:41 PM",
        swap: 0,
        pnl: -0.13
    },
    {
        btc: "BTC",
        type: "Buy",
        voulume: 0.01,
        openPrice: 109083.90,
        x: 109083.90,
        y: 109083.90,
        z: 109083.90,
        c: 109083.90,
        d:109083.90,
        closePrice: 109083.90,
        tp: "-",
        sl: "-",
        position: 2385991698,
        openTime: "Aug 31, 6:36:41 PM",
        closeTime: "Aug 31, 6:36:41 PM",
        swap: 0,
        pnl: -0.13
    },
    {
        btc: "BTC",
        type: "Buy",
        voulume: 0.01,
        openPrice: 109083.90,
        x: 109083.90,
        y: 109083.90,
        z: 109083.90,
        c: 109083.90,
        d:109083.90,
        closePrice: 109083.90,
        tp: "-",
        sl: "-",
        position: 2385991698,
        openTime: "Aug 31, 6:36:41 PM",
        closeTime: "Aug 31, 6:36:41 PM",
        swap: 0,
        pnl: -0.13
    },
]

const med = [
    {
        btc: "BTC",
        type: "Buy",
        voulume: 0.01,
        openPrice: 109083.90,
        x: 109083.90,
        y: 109083.90,
        z: 109083.90,
        c: 109083.90,
        d:109083.90,
        closePrice: 109083.90,
        tp: "-",
        sl: "-",
        position: 2385991698,
        openTime: "Aug 31, 6:36:41 PM",
        closeTime: "Aug 31, 6:36:41 PM",
        swap: 0,
        pnl: -0.13
    },
    {
        btc: "BTC",
        type: "Buy",
        voulume: 0.01,
        openPrice: 109083.90,
        x: 109083.90,
        y: 109083.90,
        z: 109083.90,
        c: 109083.90,
        d:109083.90,
        closePrice: 109083.90,
        tp: "-",
        sl: "-",
        position: 2385991698,
        openTime: "Aug 31, 6:36:41 PM",
        closeTime: "Aug 31, 6:36:41 PM",
        swap: 0,
        pnl: -0.13
    },
    {
        btc: "BTC",
        type: "Buy",
        voulume: 0.01,
        openPrice: 109083.90,
        x: 109083.90,
        y: 109083.90,
        z: 109083.90,
        c: 109083.90,
        d:109083.90,
        closePrice: 109083.90,
        tp: "-",
        sl: "-",
        position: 2385991698,
        openTime: "Aug 31, 6:36:41 PM",
        closeTime: "Aug 31, 6:36:41 PM",
        swap: 0,
        pnl: -0.13
    },
    {
        btc: "BTC",
        type: "Buy",
        voulume: 0.01,
        openPrice: 109083.90,
        x: 109083.90,
        y: 109083.90,
        z: 109083.90,
        c: 109083.90,
        d:109083.90,
        closePrice: 109083.90,
        tp: "-",
        sl: "-",
        position: 2385991698,
        openTime: "Aug 31, 6:36:41 PM",
        closeTime: "Aug 31, 6:36:41 PM",
        swap: 0,
        pnl: -0.13
    },
    {
        btc: "BTC",
        type: "Buy",
        voulume: 0.01,
        openPrice: 109083.90,
        x: 109083.90,
        y: 109083.90,
        z: 109083.90,
        c: 109083.90,
        d:109083.90,
        closePrice: 109083.90,
        tp: "-",
        sl: "-",
        position: 2385991698,
        openTime: "Aug 31, 6:36:41 PM",
        closeTime: "Aug 31, 6:36:41 PM",
        swap: 0,
        pnl: -0.13
    },
    {
        btc: "BTC",
        type: "Buy",
        voulume: 0.01,
        openPrice: 109083.90,
        x: 109083.90,
        y: 109083.90,
        z: 109083.90,
        c: 109083.90,
        d:109083.90,
        closePrice: 109083.90,
        tp: "-",
        sl: "-",
        position: 2385991698,
        openTime: "Aug 31, 6:36:41 PM",
        closeTime: "Aug 31, 6:36:41 PM",
        swap: 0,
        pnl: -0.13
    },
    {
        btc: "BTC",
        type: "Buy",
        voulume: 0.01,
        openPrice: 109083.90,
        x: 109083.90,
        y: 109083.90,
        z: 109083.90,
        c: 109083.90,
        d:109083.90,
        closePrice: 109083.90,
        tp: "-",
        sl: "-",
        position: 2385991698,
        openTime: "Aug 31, 6:36:41 PM",
        closeTime: "Aug 31, 6:36:41 PM",
        swap: 0,
        pnl: -0.13
    },
    {
        btc: "BTC",
        type: "Buy",
        voulume: 0.01,
        openPrice: 109083.90,
        x: 109083.90,
        y: 109083.90,
        z: 109083.90,
        c: 109083.90,
        d:109083.90,
        closePrice: 109083.90,
        tp: "-",
        sl: "-",
        position: 2385991698,
        openTime: "Aug 31, 6:36:41 PM",
        closeTime: "Aug 31, 6:36:41 PM",
        swap: 0,
        pnl: -0.13
    },
]

const longData: OrderRowProps[] = [
    {
        btc: "BTC",
        type: "Buy",
        voulume: 0.01,
        openPrice: 109083.90,
        x: 109083.90,
        y: 109083.90,
        z: 109083.90,
        c: 109083.90,
        d:109083.90,
        closePrice: 109083.90,
        tp: "-",
        sl: "-",
        position: 2385991698,
        openTime: "Aug 31, 6:36:41 PM",
        closeTime: "Aug 31, 6:36:41 PM",
        swap: 0,
        pnl: -0.13
    },
    {
        btc: "BTC",
        type: "Buy",
        voulume: 0.01,
        openPrice: 109083.90,
        x: 109083.90,
        y: 109083.90,
        z: 109083.90,
        c: 109083.90,
        d:109083.90,
        closePrice: 109083.90,
        tp: "-",
        sl: "-",
        position: 2385991698,
        openTime: "Aug 31, 6:36:41 PM",
        closeTime: "Aug 31, 6:36:41 PM",
        swap: 0,
        pnl: -0.13
    },
    {
        btc: "BTC",
        type: "Buy",
        voulume: 0.01,
        openPrice: 109083.90,
        x: 109083.90,
        y: 109083.90,
        z: 109083.90,
        c: 109083.90,
        d:109083.90,
        closePrice: 109083.90,
        tp: "-",
        sl: "-",
        position: 2385991698,
        openTime: "Aug 31, 6:36:41 PM",
        closeTime: "Aug 31, 6:36:41 PM",
        swap: 0,
        pnl: -0.13
    },
    {
        btc: "BTC",
        type: "Buy",
        voulume: 0.01,
        openPrice: 109083.90,
        x: 109083.90,
        y: 109083.90,
        z: 109083.90,
        c: 109083.90,
        d:109083.90,
        closePrice: 109083.90,
        tp: "-",
        sl: "-",
        position: 2385991698,
        openTime: "Aug 31, 6:36:41 PM",
        closeTime: "Aug 31, 6:36:41 PM",
        swap: 0,
        pnl: -0.13
    },
    {
        btc: "BTC",
        type: "Buy",
        voulume: 0.01,
        openPrice: 109083.90,
        x: 109083.90,
        y: 109083.90,
        z: 109083.90,
        c: 109083.90,
        d:109083.90,
        closePrice: 109083.90,
        tp: "-",
        sl: "-",
        position: 2385991698,
        openTime: "Aug 31, 6:36:41 PM",
        closeTime: "Aug 31, 6:36:41 PM",
        swap: 0,
        pnl: -0.13
    },
    {
        btc: "BTC",
        type: "Buy",
        voulume: 0.01,
        openPrice: 109083.90,
        x: 109083.90,
        y: 109083.90,
        z: 109083.90,
        c: 109083.90,
        d:109083.90,
        closePrice: 109083.90,
        tp: "-",
        sl: "-",
        position: 2385991698,
        openTime: "Aug 31, 6:36:41 PM",
        closeTime: "Aug 31, 6:36:41 PM",
        swap: 0,
        pnl: -0.13
    },
    {
        btc: "BTC",
        type: "Buy",
        voulume: 0.01,
        openPrice: 109083.90,
        x: 109083.90,
        y: 109083.90,
        z: 109083.90,
        c: 109083.90,
        d:109083.90,
        closePrice: 109083.90,
        tp: "-",
        sl: "-",
        position: 2385991698,
        openTime: "Aug 31, 6:36:41 PM",
        closeTime: "Aug 31, 6:36:41 PM",
        swap: 0,
        pnl: -0.13
    },
    {
        btc: "BTC",
        type: "Buy",
        voulume: 0.01,
        openPrice: 109083.90,
        x: 109083.90,
        y: 109083.90,
        z: 109083.90,
        c: 109083.90,
        d:109083.90,
        closePrice: 109083.90,
        tp: "-",
        sl: "-",
        position: 2385991698,
        openTime: "Aug 31, 6:36:41 PM",
        closeTime: "Aug 31, 6:36:41 PM",
        swap: 0,
        pnl: -0.13
    },
    {
        btc: "BTC",
        type: "Buy",
        voulume: 0.01,
        openPrice: 109083.90,
        x: 109083.90,
        y: 109083.90,
        z: 109083.90,
        c: 109083.90,
        d:109083.90,
        closePrice: 109083.90,
        tp: "-",
        sl: "-",
        position: 2385991698,
        openTime: "Aug 31, 6:36:41 PM",
        closeTime: "Aug 31, 6:36:41 PM",
        swap: 0,
        pnl: -0.13
    },
    {
        btc: "BTC",
        type: "Buy",
        voulume: 0.01,
        openPrice: 109083.90,
        x: 109083.90,
        y: 109083.90,
        z: 109083.90,
        c: 109083.90,
        d:109083.90,
        closePrice: 109083.90,
        tp: "-",
        sl: "-",
        position: 2385991698,
        openTime: "Aug 31, 6:36:41 PM",
        closeTime: "Aug 31, 6:36:41 PM",
        swap: 0,
        pnl: -0.13
    },
    {
        btc: "BTC",
        type: "Buy",
        voulume: 0.01,
        openPrice: 109083.90,
        x: 109083.90,
        y: 109083.90,
        z: 109083.90,
        c: 109083.90,
        d:109083.90,
        closePrice: 109083.90,
        tp: "-",
        sl: "-",
        position: 2385991698,
        openTime: "Aug 31, 6:36:41 PM",
        closeTime: "Aug 31, 6:36:41 PM",
        swap: 0,
        pnl: -0.13
    },
    {
        btc: "BTC",
        type: "Buy",
        voulume: 0.01,
        openPrice: 109083.90,
        x: 109083.90,
        y: 109083.90,
        z: 109083.90,
        c: 109083.90,
        d:109083.90,
        closePrice: 109083.90,
        tp: "-",
        sl: "-",
        position: 2385991698,
        openTime: "Aug 31, 6:36:41 PM",
        closeTime: "Aug 31, 6:36:41 PM",
        swap: 0,
        pnl: -0.13
    },{
        btc: "BTC",
        type: "Buy",
        voulume: 0.01,
        openPrice: 109083.90,
        x: 109083.90,
        y: 109083.90,
        z: 109083.90,
        c: 109083.90,
        d:109083.90,
        closePrice: 109083.90,
        tp: "-",
        sl: "-",
        position: 2385991698,
        openTime: "Aug 31, 6:36:41 PM",
        closeTime: "Aug 31, 6:36:41 PM",
        swap: 0,
        pnl: -0.13
    },
    {
        btc: "BTC",
        type: "Buy",
        voulume: 0.01,
        openPrice: 109083.90,
        x: 109083.90,
        y: 109083.90,
        z: 109083.90,
        c: 109083.90,
        d:109083.90,
        closePrice: 109083.90,
        tp: "-",
        sl: "-",
        position: 2385991698,
        openTime: "Aug 31, 6:36:41 PM",
        closeTime: "Aug 31, 6:36:41 PM",
        swap: 0,
        pnl: -0.13
    },
    {
        btc: "BTC",
        type: "Buy",
        voulume: 0.01,
        openPrice: 109083.90,
        x: 109083.90,
        y: 109083.90,
        z: 109083.90,
        c: 109083.90,
        d:109083.90,
        closePrice: 109083.90,
        tp: "-",
        sl: "-",
        position: 2385991698,
        openTime: "Aug 31, 6:36:41 PM",
        closeTime: "Aug 31, 6:36:41 PM",
        swap: 0,
        pnl: -0.13
    },
    {
        btc: "BTC",
        type: "Buy",
        voulume: 0.01,
        openPrice: 109083.90,
        x: 109083.90,
        y: 109083.90,
        z: 109083.90,
        c: 109083.90,
        d:109083.90,
        closePrice: 109083.90,
        tp: "-",
        sl: "-",
        position: 2385991698,
        openTime: "Aug 31, 6:36:41 PM",
        closeTime: "Aug 31, 6:36:41 PM",
        swap: 0,
        pnl: -0.13
    },
    {
        btc: "BTC",
        type: "Buy",
        voulume: 0.01,
        openPrice: 109083.90,
        x: 109083.90,
        y: 109083.90,
        z: 109083.90,
        c: 109083.90,
        d:109083.90,
        closePrice: 109083.90,
        tp: "-",
        sl: "-",
        position: 2385991698,
        openTime: "Aug 31, 6:36:41 PM",
        closeTime: "Aug 31, 6:36:41 PM",
        swap: 0,
        pnl: -0.13
    },
    {
        btc: "BTC",
        type: "Buy",
        voulume: 0.01,
        openPrice: 109083.90,
        x: 109083.90,
        y: 109083.90,
        z: 109083.90,
        c: 109083.90,
        d:109083.90,
        closePrice: 109083.90,
        tp: "-",
        sl: "-",
        position: 2385991698,
        openTime: "Aug 31, 6:36:41 PM",
        closeTime: "Aug 31, 6:36:41 PM",
        swap: 0,
        pnl: -0.13
    },
    {
        btc: "BTC",
        type: "Buy",
        voulume: 0.01,
        openPrice: 109083.90,
        x: 109083.90,
        y: 109083.90,
        z: 109083.90,
        c: 109083.90,
        d:109083.90,
        closePrice: 109083.90,
        tp: "-",
        sl: "-",
        position: 2385991698,
        openTime: "Aug 31, 6:36:41 PM",
        closeTime: "Aug 31, 6:36:41 PM",
        swap: 0,
        pnl: -0.13
    },
    {
        btc: "BTC",
        type: "Buy",
        voulume: 0.01,
        openPrice: 109083.90,
        x: 109083.90,
        y: 109083.90,
        z: 109083.90,
        c: 109083.90,
        d:109083.90,
        closePrice: 109083.90,
        tp: "-",
        sl: "-",
        position: 2385991698,
        openTime: "Aug 31, 6:36:41 PM",
        closeTime: "Aug 31, 6:36:41 PM",
        swap: 0,
        pnl: -0.13
    },
    {
        btc: "BTC",
        type: "Buy",
        voulume: 0.01,
        openPrice: 109083.90,
        x: 109083.90,
        y: 109083.90,
        z: 109083.90,
        c: 109083.90,
        d:109083.90,
        closePrice: 109083.90,
        tp: "-",
        sl: "-",
        position: 2385991698,
        openTime: "Aug 31, 6:36:41 PM",
        closeTime: "Aug 31, 6:36:41 PM",
        swap: 0,
        pnl: -0.13
    },
    {
        btc: "BTC",
        type: "Buy",
        voulume: 0.01,
        openPrice: 109083.90,
        x: 109083.90,
        y: 109083.90,
        z: 109083.90,
        c: 109083.90,
        d:109083.90,
        closePrice: 109083.90,
        tp: "-",
        sl: "-",
        position: 2385991698,
        openTime: "Aug 31, 6:36:41 PM",
        closeTime: "Aug 31, 6:36:41 PM",
        swap: 0,
        pnl: -0.13
    },
    {
        btc: "LOL",
        type: "Buy",
        voulume: 0.01,
        openPrice: 109083.90,
        x: 109083.90,
        y: 109083.90,
        z: 109083.90,
        c: 109083.90,
        d:109083.90,
        closePrice: 109083.90,
        tp: "-",
        sl: "-",
        position: 2385991698,
        openTime: "Aug 31, 6:36:41 PM",
        closeTime: "Aug 31, 6:36:41 PM",
        swap: 0,
        pnl: -0.13
    },
]

export function OrderTab() {
    const [tab, setTab] = useState(0);
    
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
                    <TabComponent  tab={tab} setTab={setTab} index={1} label={"Pending"}/>
                    <TabComponent  tab={tab} setTab={setTab} index={2} label={"Close"}/>
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
                                        [...Array(17)].map((_, i) => 
                                            <th key={i} style={{border: "1px solid #ccc", padding: "8px", textAlign: "left", background: "#eee"}}>ABC</th>
                                        )
                                    }
                                </tr>
                            </thead>
                            <TableBodyComponent rows={longData}/>
                        </table>
                    }
                </div>
            </div>  
        </div>
}


function TabComponent({tab, setTab, index, label} : TabComponentProps) {
    return <div style={{color: "white", fontWeight: tab === index ? "bolder" : "normal"}} 
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

function TableBodyComponent({rows}: {rows: OrderRowProps[]}) {
    return <tbody >
        {
            rows.map((row, index) => {
                return <tr key={index}>
                    {
                        Object.values(row).map((value, index) => {
                            return <td key={index} style={{border: "1px solid #ccc", padding: "8px", color: "white"}}>{value}</td>
                        })
                    }
                </tr>
            })
        }
    </tbody>
}

// function CellComponent({cellIndex, content}: CellComponentProps) {
//     return <div
//         key={cellIndex}
//         style={{ flex: 1, textAlign: "left", padding: "0 8px" }}
//         >
//         {content}
//     </div>
// }

