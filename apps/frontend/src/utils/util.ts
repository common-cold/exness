import type { ClosedOrders, CloseOrderBody, CreateOrderBody } from "@repo/types/client";
import axios from "axios";


export async function getCandlesInTimeRange(time: string, startTime: number, endTime: number) {
    try {
        let response = await axios.get("http://localhost:8080/candles", {
            params: {
                time: time,
                startTime: startTime,
                endTime: endTime
            }
        });

        return response.data;
    } catch (e) {
        console.log(e);
        return [];
    }
    
}

export async function createOrder(args: CreateOrderBody) {
    try {
        let response = await axios.post("http://localhost:8080/create/order", args);
        return response;
    } catch (e) {
        console.log(e);
        return null;
    }

} 

export async function getUserOrders(type: "Closed" | "Open", userId: string) {
    try {
        let response;
        if (type === "Closed") {
            response = await axios.post("http://localhost:8080/user/order", {
                userId: userId
            });
        } else if (type === "Open") {
            response = await axios.post("http://localhost:8080/open-order", {
                userId: userId
            });
        } else {
            return null;
        }

        if (response.status === 200) {
            return response.data;
        } else {
            return null;
        }
    } catch(e) {
        console.log(e);
        return null;
    }
}


export async function closeUserOrder(args: CloseOrderBody) {
    console.log(args);
    try {
        let response = await axios.post("http://localhost:8080/close/order", args);
        return response;
    } catch(e) {
        console.log(e);
        return null;
    }
}