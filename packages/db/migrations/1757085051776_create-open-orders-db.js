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

        CREATE TYPE order_type AS ENUM ('Long', 'Short');

        CREATE TABLE open_orders (
            id SERIAL PRIMARY KEY,
            type order_type NOT NULL,
            asset TEXT NOT NULL,
            entry_price BIGINT NOT NULL,
            margin BIGINT NOT NULL,
            qty BIGINT NOT NULL,
            user_id UUID REFERENCES users(id)
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
        DROP TABLE IF EXISTS open_orders;
        DROP TYPE IF EXISTS order_type;
    `);
};
