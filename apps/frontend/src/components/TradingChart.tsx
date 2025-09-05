import type { Kline } from '@repo/types/client';
import { CandlestickSeries, ColorType, createChart, type IChartApi, type UTCTimestamp } from 'lightweight-charts';
import { useEffect, useRef } from 'react';
import { getCandlesInTimeRange } from '../utils/util';

export function TradingChart({time} : {time: string}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const earliestCandle = useRef<number | null>(null);
    let chart: IChartApi | null = null;
    let candlestickSeries: any;

    async function updateSheetData(time: string, startTime: number, endTime: number) {
        const response = await getCandlesInTimeRange(time, startTime, endTime);
        if (response.length == 0) {
            return;
        }
        const candleSticks = response.map((kline: Kline)=> {
            return {  
                time: Math.floor(new Date(kline.ts.toString()).getTime()/1000), 
                open: kline.open, 
                high: kline.high, 
                low: kline.low, 
                close: kline.close 
            }
        });
        candlestickSeries.setData(candleSticks);;
        earliestCandle.current = candleSticks[0].time;
    }


    useEffect(() => {
        if (!containerRef.current) return;

        chart = createChart(containerRef.current, {
            layout: { 
                textColor: '#50585c',
                background: { 
                    type: ColorType.Solid , 
                    color: '#141d22' 
                },
                attributionLogo: false
            },
            grid: {
                vertLines: {
                  color: '#50585c',  
                  style: 1,          
                },
                horzLines: {
                  color: '#50585c',
                  style: 1,
                },
            },    
            width: containerRef.current.clientWidth,
            height: 300,
        });

        chart.timeScale().applyOptions({
            timeVisible: true,
            secondsVisible: true
        })

        chart.timeScale().subscribeVisibleTimeRangeChange(async (newRange) => {
            if (newRange === null || earliestCandle.current === null) {
                return;
            } else {
                const from = newRange.from as UTCTimestamp;
                // console.log(JSON.stringify({
                //     from: from,
                //     earlliest: earliestCandle.current
                // }));
                if (from <= earliestCandle.current) {
                    let thirtyMinsBefore = earliestCandle.current - 2 * 24 * 60 * 60;
                    await updateSheetData(time, thirtyMinsBefore, currTime);
                }
            }
        })


        candlestickSeries = chart.addSeries(CandlestickSeries, {
            upColor: '#158bf9',
            downColor: '#eb483f',
            borderVisible: true,
            wickUpColor: '#158bf9',
            wickDownColor: '#eb483f',
        });

        let currTime = new Date().getTime()/1000;
        let thirtyMinsBefore = currTime - 2 * 24 * 60 * 60;

        updateSheetData(time, thirtyMinsBefore, currTime);

        return () => {
            if (chart != null) {
                chart.timeScale().unsubscribeVisibleTimeRangeChange(() => {

                });
                chart.remove();
            }   
        };
    }, [time]);



    return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}
