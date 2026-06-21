import { pool } from "../../config/db.js";
import { parsePagination } from "../../utils/pagination.js";
import type { Request } from "express";

export async function listSellers(query: Request["query"]) {
  const { limit, offset, search, sort, order } = parsePagination(query);

  let where = "WHERE is_active = true";
  const values: (string | number)[] = [];
  let idx = 1;

  if (search) {
    where += ` AND (name ILIKE $${idx} OR tax_id ILIKE $${idx})`;
    values.push(`%${search}%`);
    idx++;
  }

  const sortColumn = ["name", "tier", "created_at"].includes(sort as string)
    ? sort
    : "created_at";

  const countResult = await pool.query(
    `SELECT COUNT(*) FROM sellers ${where}`,
    values
  );
  const count = Number(countResult.rows[0].count);

  values.push(limit, offset);
  const result = await pool.query(
    `SELECT * FROM sellers
     ${where}
     ORDER BY ${sortColumn} ${order}
     LIMIT $${idx} OFFSET $${idx + 1}`,
    values
  );

  return { count, results: result.rows, limit, offset };
}

export async function getSellerById(id: string) {
  const result = await pool.query("SELECT * FROM sellers WHERE id = $1", [id]);
  return result.rows[0] || null;
}

export async function createSeller(data: {
  name: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
  tax_id?: string;
  tier: string;
}) {
  const result = await pool.query(
    `INSERT INTO sellers (name, contact_person, phone, email, address, tax_id, tier)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      data.name,
      data.contact_person || null,
      data.phone || null,
      data.email || null,
      data.address || null,
      data.tax_id || null,
      data.tier,
    ]
  );
  return result.rows[0];
}

export async function updateSeller(
  id: string,
  data: Partial<{
    name: string;
    contact_person: string;
    phone: string;
    email: string;
    address: string;
    tax_id: string;
    tier: string;
    is_active: boolean;
  }>
) {
  const fields: string[] = [];
  const values: (string | number | boolean)[] = [];
  let idx = 1;

  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      fields.push(`${key} = $${idx}`);
      values.push(value);
      idx++;
    }
  }

  if (fields.length === 0) {
    return getSellerById(id);
  }

  values.push(id);
  const result = await pool.query(
    `UPDATE sellers SET ${fields.join(", ")}, updated_at = now()
     WHERE id = $${idx}
     RETURNING *`,
    values
  );
  return result.rows[0];
}

export async function deleteSeller(id: string) {
  await pool.query("UPDATE sellers SET is_active = false WHERE id = $1", [id]);
}
