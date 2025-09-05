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

        CREATE TABLE users (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            free_balance BIGINT NOT NULL DEFAULT 0,
            locked_balance BIGINT NOT NULL DEFAULT 0
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
        DROP TABLE IF EXISTS users ;
        DROP EXTENSION IF EXISTS "uuid-ossp";   
    `);
};
