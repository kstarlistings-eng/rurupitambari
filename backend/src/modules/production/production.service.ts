import { pool } from "../../config/db.js";
import { parsePagination } from "../../utils/pagination.js";
import type { Request } from "express";

export interface ConsumptionInput {
  raw_material_id: string;
  quantity_consumed: number;
}

export async function listProductionOrders(query: Request["query"]) {
  const { limit, offset, search, sort, order } = parsePagination(query);

  let where = "";
  const values: (string | number)[] = [];
  let idx = 1;

  if (search) {
    where = `WHERE po.batch_number ILIKE $${idx} OR po.product_name ILIKE $${idx}`;
    values.push(`%${search}%`);
    idx++;
  }

  const sortColumn = ["batch_number", "production_date", "status", "created_at"].includes(sort as string)
    ? sort
    : "po.created_at";

  const countResult = await pool.query(
    `SELECT COUNT(*) FROM production_orders po ${where}`,
    values
  );
  const count = Number(countResult.rows[0].count);

  values.push(limit, offset);
  const result = await pool.query(
    `SELECT po.*,
            u.first_name || ' ' || u.last_name as created_by_name
     FROM production_orders po
     LEFT JOIN users u ON po.created_by = u.id
     ${where}
     ORDER BY ${sortColumn} ${order}
     LIMIT $${idx} OFFSET $${idx + 1}`,
    values
  );

  return { count, results: result.rows, limit, offset };
}

export async function getProductionOrderById(id: string) {
  const orderResult = await pool.query(
    `SELECT po.*,
            u.first_name || ' ' || u.last_name as created_by_name
     FROM production_orders po
     LEFT JOIN users u ON po.created_by = u.id
     WHERE po.id = $1`,
    [id]
  );
  if (!orderResult.rows[0]) return null;

  const consumptionResult = await pool.query(
    `SELECT pc.*, rm.material_name, rm.material_id, rm.uom
     FROM production_consumptions pc
     JOIN raw_materials rm ON pc.raw_material_id = rm.id
     WHERE pc.production_order_id = $1`,
    [id]
  );

  return {
    ...orderResult.rows[0],
    consumptions: consumptionResult.rows,
  };
}

export async function createProductionOrder(
  data: {
    batch_number: string;
    product_name: string;
    quantity_produced: number;
    production_date: string;
    shift: string;
    supervisor_name: string;
    machine_line_number: string;
    consumptions: ConsumptionInput[];
  },
  userId: string
) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Validate and decrement raw material stock
    for (const consumption of data.consumptions) {
      const stockResult = await client.query(
        "SELECT current_quantity FROM raw_materials WHERE id = $1 FOR UPDATE",
        [consumption.raw_material_id]
      );
      const stock = stockResult.rows[0];
      if (!stock) {
        throw new Error(`Raw material ${consumption.raw_material_id} not found`);
      }
      if (Number(stock.current_quantity) < Number(consumption.quantity_consumed)) {
        throw new Error("Insufficient raw material stock");
      }
      await client.query(
        `UPDATE raw_materials
         SET current_quantity = current_quantity - $1, updated_at = now()
         WHERE id = $2`,
        [consumption.quantity_consumed, consumption.raw_material_id]
      );
    }

    // Create production order
    const orderResult = await client.query(
      `INSERT INTO production_orders
       (batch_number, product_name, quantity_produced, production_date, shift, supervisor_name, machine_line_number, status, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending_transfer', $8)
       RETURNING *`,
      [
        data.batch_number,
        data.product_name,
        data.quantity_produced,
        data.production_date,
        data.shift,
        data.supervisor_name,
        data.machine_line_number,
        userId,
      ]
    );
    const productionOrder = orderResult.rows[0];

    // Create consumption records
    for (const consumption of data.consumptions) {
      await client.query(
        `INSERT INTO production_consumptions
         (production_order_id, raw_material_id, quantity_consumed)
         VALUES ($1, $2, $3)`,
        [productionOrder.id, consumption.raw_material_id, consumption.quantity_consumed]
      );
    }

    // Create pending transfer to store
    await client.query(
      `INSERT INTO transfers (production_order_id, quantity, status)
       VALUES ($1, $2, 'pending')`,
      [productionOrder.id, data.quantity_produced]
    );

    await client.query("COMMIT");
    return productionOrder;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function updateProductionOrder(
  id: string,
  data: Partial<{
    product_name: string;
    supervisor_name: string;
    machine_line_number: string;
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
    return getProductionOrderById(id);
  }

  values.push(id);
  const result = await pool.query(
    `UPDATE production_orders SET ${fields.join(", ")}, updated_at = now()
     WHERE id = $${idx}
     RETURNING *`,
    values
  );
  return result.rows[0];
}

export async function deleteProductionOrder(id: string) {
  await pool.query("DELETE FROM production_orders WHERE id = $1", [id]);
}
