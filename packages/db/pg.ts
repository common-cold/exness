import {Client, Pool} from 'pg';
import type {Kline} from '@repo/types/client';
import dotenv from "dotenv";
import { join } from "path";

dotenv.config({ path: join(__dirname, "..", "..", ".env") });

let pool: Pool | null = null;
try {
    console.log("DB_URL = " + process.env.DATABASE_URL);
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        max: 10,
        idleTimeoutMillis: 30000,
        ssl: { rejectUnauthorized: false }
    });
} catch (e) {
    console.log(e);
}


export async function insertKline(kline: Kline) {
   const query = `
        INSERT INTO kline_1m (ts, open, high, low, close, volume)
        VALUES (to_timestamp($1), $2, $3, $4, $5, $6)
        ON CONFLICT (ts) DO UPDATE
            SET open = EXCLUDED.open,
                low = EXCLUDED.low,
                close = EXCLUDED.close,
                high = EXCLUDED.high,
                volume = EXCLUDED.volume;
    `

    try {
        if (!pool) {
            return;
        }
        const client = await pool.connect();
        await client.query(query, [kline.ts, kline.open, kline.high, kline.low, kline.close, kline.volume]);
        client.release();
    } catch (e) {
        console.log(e);
    }
    
}