import pg from "pg";
import { env } from "./env.js";

const { Pool } = pg;

// Supabase and most managed PostgreSQL providers require SSL in production.
// In local development the connection is usually unencrypted, so we only
// enable SSL when NODE_ENV is "production" or when DATABASE_URL already
// contains sslmode/require parameters.
const isProduction = env.NODE_ENV === "production";
const needsSsl = isProduction || env.DATABASE_URL.includes("sslmode=require");

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: needsSsl
    ? {
        rejectUnauthorized: false, // Required for Supabase pooled connections
      }
    : undefined,
});

pool.on("error", (err) => {
  console.error("Unexpected database error", err);
  process.exit(-1);
});

export type DbClient = pg.PoolClient;
