import axios from "axios";

export async function getCandlesInTimeRange(time: string, startTime: number, endTime: number) {
    let response = await axios.get("http://localhost:8080/candles", {
        params: {
            time: time,
            startTime: startTime,
            endTime: endTime
        }
    });

    return response.data;
}