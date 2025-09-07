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
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

        CREATE TABLE closed_orders (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            type order_type NOT NULL,
            asset TEXT NOT NULL,
            margin BIGINT NOT NULL,
            qty BIGINT NOT NULL,
            entry_price BIGINT NOT NULL,
            exit_price BIGINT NOT NULL,
            entry_time BIGINT NOT NULL,
            exit_time BIGINT NOT NULL,
            p_l BIGINT NOT NULL,
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
        DROP TABLE IF EXISTS closed_orders;
    `);
};
