import btc from "../assets/btc.png";
import { usePrev } from "../hooks/usePrev";

export function Pricebar({value}: {value: number}) {
    const prevValue = usePrev(value);
    return <div className="greyBorder gridContent">
        <div style={{display: "flex", flexDirection: "column"}}>
            <Header/>
            <PriceRow firstRow={true} value={value} prevValue={prevValue}/>
            <PriceRow value={value - 800} prevValue={prevValue}/>
            <PriceRow value={value + 100} prevValue={prevValue}/>
            <PriceRow value={value - 900} prevValue={prevValue}/>
        </div>
    </div>
}

function Header() {
    return <div style={{padding: "4px", display: "grid", gridTemplateColumns: "4fr 8fr"}}>
        <div style={{color: "#939586"}}>
            Symbol
        </div>
        <div style={{display: "grid", gridTemplateColumns: "2fr 6fr 6fr", color: "#939586", gap: "8px"}}>
            <div>
                Signal
            </div>
            <div>
                Bid
            </div>
            <div>
                Ask
            </div>
        </div>
    </div>
}

function PriceRow({firstRow, value, prevValue}: {firstRow?: boolean, value: number, prevValue: number}) {
    return <div style={{display: "grid", gridTemplateColumns: "4fr 8fr", borderBottom: "2px solid #3f474b", 
        borderTop: firstRow ? "2px solid #3f474b": "0px", borderColor: "#3f474b"}}>
        <div style={{borderRight: "2px solid #3f474b", borderColor: "#3f474b"}}>
            <div style={{padding: "4px", display: "flex", justifyContent: "flex-start", gap: "6px"}}>
                <img
                    className="iconStyle" 
                    src={btc}
                />
                <div style={{color: "white"}}>
                    BTC
                </div>
            </div>       
        </div>
        
        <div style={{display: "grid", gridTemplateColumns: "2fr 6fr 6fr", gap: "8px"}}>
            <div>
                Hel 
            </div>
            <PriceBox price={value} hasIncreased={value > prevValue}/>
            <PriceBox price={value} hasIncreased={value > prevValue}/>
        </div>
         
    </div>
}

function PriceBox({price, hasIncreased}: {price: number, hasIncreased: boolean}) {
    return <div style={{alignItems: "center", alignContent: "center", padding: "3px", height: "15px", width: "100px", overflow: "hidden", backgroundColor: hasIncreased ? "#46cd7c" : "#eb483f", transition: "0.3s ease"}}>
        {price}
    </div>
}


