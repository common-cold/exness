import { OrderTab } from "./OrderTab";
import { TradingChart } from "./TradingChart";

export function MiddleSection() {
    return <div style={{display: "flex", flexDirection: "column", overflow: "hidden"}} className="greyBorder gridContent">
        <div id="chart" style={{width: "100%", flex: "0.5"}} className="greyBorder">
            <TradingChart time={"1m"}/>
        </div>
        <OrderTab/>
    </div>
}













