import { pool } from "../../config/db.js";
import { parsePagination } from "../../utils/pagination.js";
import type { Request } from "express";

export async function listTransfers(query: Request["query"]) {
  const { limit, offset, search, sort, order } = parsePagination(query);

  let where = "";
  const values: (string | number)[] = [];
  let idx = 1;

  if (search) {
    where = `WHERE po.batch_number ILIKE $${idx} OR po.product_name ILIKE $${idx}`;
    values.push(`%${search}%`);
    idx++;
  }

  const statusFilter = query.status;
  if (statusFilter && typeof statusFilter === "string") {
    where = where
      ? `${where} AND t.status = $${idx}`
      : `WHERE t.status = $${idx}`;
    values.push(statusFilter);
    idx++;
  }

  const sortColumn = ["transferred_at", "received_at", "status"].includes(sort as string)
    ? sort
    : "t.transferred_at";

  const countResult = await pool.query(
    `SELECT COUNT(*) FROM transfers t
     JOIN production_orders po ON t.production_order_id = po.id
     ${where}`,
    values
  );
  const count = Number(countResult.rows[0].count);

  values.push(limit, offset);
  const result = await pool.query(
    `SELECT t.*,
            po.batch_number, po.product_name, po.quantity_produced,
            u.first_name || ' ' || u.last_name as received_by_name
     FROM transfers t
     JOIN production_orders po ON t.production_order_id = po.id
     LEFT JOIN users u ON t.received_by = u.id
     ${where}
     ORDER BY ${sortColumn} ${order}
     LIMIT $${idx} OFFSET $${idx + 1}`,
    values
  );

  return { count, results: result.rows, limit, offset };
}

export async function getTransferById(id: string) {
  const result = await pool.query(
    `SELECT t.*,
            po.batch_number, po.product_name, po.quantity_produced
     FROM transfers t
     JOIN production_orders po ON t.production_order_id = po.id
     WHERE t.id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

export async function receiveTransfer(transferId: string, userId: string) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const transferResult = await client.query(
      `SELECT t.*, po.product_name, po.quantity_produced, po.batch_number
       FROM transfers t
       JOIN production_orders po ON t.production_order_id = po.id
       WHERE t.id = $1
       FOR UPDATE`,
      [transferId]
    );
    const transfer = transferResult.rows[0];
    if (!transfer) {
      throw new Error("Transfer not found");
    }
    if (transfer.status === "received") {
      throw new Error("Transfer already received");
    }

    // Update transfer
    await client.query(
      `UPDATE transfers
       SET status = 'received', received_at = now(), received_by = $1
       WHERE id = $2`,
      [userId, transferId]
    );

    // Update production order status
    await client.query(
      `UPDATE production_orders
       SET status = 'transferred', updated_at = now()
       WHERE id = $1`,
      [transfer.production_order_id]
    );

    // Upsert finished goods
    const existingFg = await client.query(
      "SELECT id FROM finished_goods WHERE production_order_id = $1 FOR UPDATE",
      [transfer.production_order_id]
    );

    if (existingFg.rows.length > 0) {
      await client.query(
        `UPDATE finished_goods
         SET quantity_available = quantity_available + $1
         WHERE production_order_id = $2`,
        [transfer.quantity, transfer.production_order_id]
      );
    } else {
      await client.query(
        `INSERT INTO finished_goods
         (product_name, batch_number, quantity_available, production_order_id, received_by)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          transfer.product_name,
          transfer.batch_number,
          transfer.quantity,
          transfer.production_order_id,
          userId,
        ]
      );
    }

    await client.query("COMMIT");
    return getTransferById(transferId);
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
