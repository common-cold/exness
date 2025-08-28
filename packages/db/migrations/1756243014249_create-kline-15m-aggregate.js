/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.sql(`
        CREATE MATERIALIZED VIEW kline_15m
        WITH (timescaledb.continuous) AS
        SELECT time_bucket('15 minutes', ts) AS bucket,
            first(open, ts) AS open,
            max(high) AS high,
            min(low) AS low,
            last(close, ts) AS close,
            sum(volume) AS volume
        FROM kline_1m
        GROUP BY bucket
        WITH NO DATA;
    `);

    pgm.sql(`
        SELECT add_continuous_aggregate_policy('kline_15m',
            start_offset => INTERVAL '1 hour',
            end_offset => INTERVAL '1 minute',
            schedule_interval => INTERVAL '1 minute'
        );
    `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.sql(`
        DROP MATERIALIZED VIEW IF EXISTS kline_15m
    `);
};
