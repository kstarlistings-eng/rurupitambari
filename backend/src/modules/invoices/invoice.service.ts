import { pool } from "../../config/db.js";
import { parsePagination } from "../../utils/pagination.js";
import type { Request } from "express";

export async function listInvoices(query: Request["query"]) {
  const { limit, offset, search, sort, order } = parsePagination(query);

  let where = "";
  const values: (string | number)[] = [];
  let idx = 1;

  if (search) {
    where = `WHERE i.invoice_number ILIKE $${idx} OR s.name ILIKE $${idx}`;
    values.push(`%${search}%`);
    idx++;
  }

  const sortColumn = ["created_at", "total_amount"].includes(sort as string)
    ? sort
    : "i.created_at";

  const countResult = await pool.query(
    `SELECT COUNT(*) FROM invoices i
     JOIN sellers s ON i.seller_id = s.id
     ${where}`,
    values
  );
  const count = Number(countResult.rows[0].count);

  values.push(limit, offset);
  const result = await pool.query(
    `SELECT i.*,
            s.name as seller_name,
            u.first_name || ' ' || u.last_name as created_by_name
     FROM invoices i
     JOIN sellers s ON i.seller_id = s.id
     LEFT JOIN users u ON i.created_by = u.id
     ${where}
     ORDER BY ${sortColumn} ${order}
     LIMIT $${idx} OFFSET $${idx + 1}`,
    values
  );

  return { count, results: result.rows, limit, offset };
}

export async function getInvoiceById(id: string) {
  const result = await pool.query(
    `SELECT i.*,
            s.name as seller_name,
            u.first_name || ' ' || u.last_name as created_by_name
     FROM invoices i
     JOIN sellers s ON i.seller_id = s.id
     LEFT JOIN users u ON i.created_by = u.id
     WHERE i.id = $1`,
    [id]
  );
  return result.rows[0] || null;
}
