import { pool } from "../../config/db.js";
import { adjustRawMaterialQuantity } from "../raw-materials/raw-material.service.js";
import { parsePagination } from "../../utils/pagination.js";
import type { Request } from "express";

export async function listExpenses(query: Request["query"]) {
  const { limit, offset, search, sort, order } = parsePagination(query);

  let where = "";
  const values: (string | number)[] = [];
  let idx = 1;

  if (search) {
    where = `WHERE e.invoice_reference ILIKE $${idx} OR s.name ILIKE $${idx}`;
    values.push(`%${search}%`);
    idx++;
  }

  const sortColumn = ["purchase_date", "total_cost", "created_at"].includes(sort as string)
    ? sort
    : "e.created_at";

  const countResult = await pool.query(
    `SELECT COUNT(*) FROM expenses e
     LEFT JOIN raw_materials rm ON e.raw_material_id = rm.id
     LEFT JOIN users u ON e.created_by = u.id
     ${where}`,
    values
  );
  const count = Number(countResult.rows[0].count);

  values.push(limit, offset);
  const result = await pool.query(
    `SELECT e.*,
            rm.material_name, rm.material_id, rm.uom,
            u.first_name || ' ' || u.last_name as created_by_name
     FROM expenses e
     LEFT JOIN raw_materials rm ON e.raw_material_id = rm.id
     LEFT JOIN users u ON e.created_by = u.id
     ${where}
     ORDER BY ${sortColumn} ${order}
     LIMIT $${idx} OFFSET $${idx + 1}`,
    values
  );

  return { count, results: result.rows, limit, offset };
}

export async function createExpense(
  data: {
    raw_material_id: string;
    quantity: number;
    unit_price: number;
    supplier_name: string;
    supplier_contact?: string;
    supplier_address?: string;
    invoice_reference?: string;
    purchase_date: string;
    total_cost?: number;
  },
  userId: string
) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const total_cost =
      data.total_cost ?? Number(data.quantity) * Number(data.unit_price);

    const expenseResult = await client.query(
      `INSERT INTO expenses
       (raw_material_id, quantity, unit_price, total_cost, supplier_name, supplier_contact, supplier_address, invoice_reference, purchase_date, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        data.raw_material_id,
        data.quantity,
        data.unit_price,
        total_cost,
        data.supplier_name,
        data.supplier_contact || null,
        data.supplier_address || null,
        data.invoice_reference || null,
        data.purchase_date,
        userId,
      ]
    );

    await adjustRawMaterialQuantity(client, data.raw_material_id, Number(data.quantity));

    await client.query("COMMIT");
    return expenseResult.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function getExpenseById(id: string) {
  const result = await pool.query(
    `SELECT e.*,
            rm.material_name, rm.material_id, rm.uom,
            u.first_name || ' ' || u.last_name as created_by_name
     FROM expenses e
     LEFT JOIN raw_materials rm ON e.raw_material_id = rm.id
     LEFT JOIN users u ON e.created_by = u.id
     WHERE e.id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

export async function updateExpense(
  id: string,
  data: Partial<{
    supplier_name: string;
    supplier_contact: string;
    supplier_address: string;
    invoice_reference: string;
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
    return getExpenseById(id);
  }

  values.push(id);
  const result = await pool.query(
    `UPDATE expenses SET ${fields.join(", ")}
     WHERE id = $${idx}
     RETURNING *`,
    values
  );
  return result.rows[0];
}

export async function deleteExpense(id: string) {
  await pool.query("DELETE FROM expenses WHERE id = $1", [id]);
}
