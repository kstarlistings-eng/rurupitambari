import { pool } from "../../config/db.js";

export async function listUsers() {
  const result = await pool.query(
    `SELECT id, email, first_name, last_name, role, is_active, created_at
     FROM users
     ORDER BY created_at DESC`
  );
  return result.rows;
}
