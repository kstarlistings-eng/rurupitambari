import { pool } from "../../config/db.js";
import { parsePagination } from "../../utils/pagination.js";
import type { Request } from "express";

export async function listFinishedGoods(query: Request["query"]) {
  const { limit, offset, search, sort, order } = parsePagination(query);

  let where = "";
  const values: (string | number)[] = [];
  let idx = 1;

  if (search) {
    where = `WHERE fg.product_name ILIKE $${idx} OR fg.batch_number ILIKE $${idx}`;
    values.push(`%${search}%`);
    idx++;
  }

  const sortColumn = ["product_name", "quantity_available", "received_at"].includes(sort as string)
    ? sort
    : "fg.received_at";

  const countResult = await pool.query(
    `SELECT COUNT(*) FROM finished_goods fg ${where}`,
    values
  );
  const count = Number(countResult.rows[0].count);

  values.push(limit, offset);
  const result = await pool.query(
    `SELECT fg.*,
            po.batch_number as production_batch,
            u.first_name || ' ' || u.last_name as received_by_name
     FROM finished_goods fg
     JOIN production_orders po ON fg.production_order_id = po.id
     LEFT JOIN users u ON fg.received_by = u.id
     ${where}
     ORDER BY ${sortColumn} ${order}
     LIMIT $${idx} OFFSET $${idx + 1}`,
    values
  );

  return { count, results: result.rows, limit, offset };
}

export async function getFinishedGoodById(id: string) {
  const result = await pool.query(
    `SELECT fg.*,
            po.batch_number as production_batch,
            u.first_name || ' ' || u.last_name as received_by_name
     FROM finished_goods fg
     JOIN production_orders po ON fg.production_order_id = po.id
     LEFT JOIN users u ON fg.received_by = u.id
     WHERE fg.id = $1`,
    [id]
  );
  return result.rows[0] || null;
}
