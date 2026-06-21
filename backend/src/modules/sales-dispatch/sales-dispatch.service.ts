import { pool } from "../../config/db.js";
import { parsePagination } from "../../utils/pagination.js";
import type { Request } from "express";

export async function listSalesDispatches(query: Request["query"]) {
  const { limit, offset, search, sort, order } = parsePagination(query);

  let where = "";
  const values: (string | number)[] = [];
  let idx = 1;

  if (search) {
    where = `WHERE s.name ILIKE $${idx} OR sd.batch_number ILIKE $${idx}`;
    values.push(`%${search}%`);
    idx++;
  }

  const sortColumn = ["order_date", "created_at"].includes(sort as string)
    ? sort
    : "sd.created_at";

  const countResult = await pool.query(
    `SELECT COUNT(*) FROM sales_dispatches sd
     JOIN sellers s ON sd.seller_id = s.id
     ${where}`,
    values
  );
  const count = Number(countResult.rows[0].count);

  values.push(limit, offset);
  const result = await pool.query(
    `SELECT sd.*,
            s.name as seller_name,
            fg.product_name,
            u.first_name || ' ' || u.last_name as created_by_name
     FROM sales_dispatches sd
     JOIN sellers s ON sd.seller_id = s.id
     JOIN finished_goods fg ON sd.finished_good_id = fg.id
     LEFT JOIN users u ON sd.created_by = u.id
     ${where}
     ORDER BY ${sortColumn} ${order}
     LIMIT $${idx} OFFSET $${idx + 1}`,
    values
  );

  return { count, results: result.rows, limit, offset };
}

export async function getSalesDispatchById(id: string) {
  const result = await pool.query(
    `SELECT sd.*,
            s.name as seller_name,
            fg.product_name,
            u.first_name || ' ' || u.last_name as created_by_name
     FROM sales_dispatches sd
     JOIN sellers s ON sd.seller_id = s.id
     JOIN finished_goods fg ON sd.finished_good_id = fg.id
     LEFT JOIN users u ON sd.created_by = u.id
     WHERE sd.id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

export async function createSalesDispatch(
  data: {
    seller_id: string;
    finished_good_id: string;
    quantity_allocated: number;
    selling_price_per_unit: number;
    order_date: string;
    batch_number: string;
  },
  userId: string
) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Check finished goods stock
    const fgResult = await client.query(
      `SELECT quantity_available, product_name FROM finished_goods WHERE id = $1 FOR UPDATE`,
      [data.finished_good_id]
    );
    const finishedGood = fgResult.rows[0];
    if (!finishedGood) {
      throw new Error("Finished good not found");
    }
    if (Number(finishedGood.quantity_available) < Number(data.quantity_allocated)) {
      throw new Error("Insufficient finished goods stock");
    }

    // Decrement finished goods
    await client.query(
      `UPDATE finished_goods
       SET quantity_available = quantity_available - $1
       WHERE id = $2`,
      [data.quantity_allocated, data.finished_good_id]
    );

    // Generate invoice
    const totalAmount =
      Number(data.quantity_allocated) * Number(data.selling_price_per_unit);
    const tax = totalAmount * 0.13; // 13% tax default
    const invoiceNumber = `INV-${Date.now()}`;

    const invoiceResult = await client.query(
      `INSERT INTO invoices (invoice_number, seller_id, total_amount, tax, status, created_by)
       VALUES ($1, $2, $3, $4, 'generated', $5)
       RETURNING *`,
      [invoiceNumber, data.seller_id, totalAmount, tax, userId]
    );
    const invoice = invoiceResult.rows[0];

    // Create sales dispatch
    const dispatchResult = await client.query(
      `INSERT INTO sales_dispatches
       (seller_id, finished_good_id, quantity_allocated, selling_price_per_unit, order_date, batch_number, invoice_id, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        data.seller_id,
        data.finished_good_id,
        data.quantity_allocated,
        data.selling_price_per_unit,
        data.order_date,
        data.batch_number,
        invoice.id,
        userId,
      ]
    );

    await client.query("COMMIT");
    return {
      ...dispatchResult.rows[0],
      invoice,
    };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function updateSalesDispatch(
  id: string,
  data: Partial<{
    order_date: string;
    batch_number: string;
  }>
) {
  const fields: string[] = [];
  const values: (string | number)[] = [];
  let idx = 1;

  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      fields.push(`${key} = $${idx}`);
      values.push(value);
      idx++;
    }
  }

  if (fields.length === 0) {
    return getSalesDispatchById(id);
  }

  values.push(id);
  const result = await pool.query(
    `UPDATE sales_dispatches SET ${fields.join(", ")}
     WHERE id = $${idx}
     RETURNING *`,
    values
  );
  return result.rows[0];
}

export async function deleteSalesDispatch(id: string) {
  await pool.query("DELETE FROM sales_dispatches WHERE id = $1", [id]);
}
