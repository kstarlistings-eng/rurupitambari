import { pool } from "../../config/db.js";
import type { DbClient } from "../../config/db.js";
import { parsePagination } from "../../utils/pagination.js";
import type { Request } from "express";

const rawMaterialSchema = {
  material_id: "",
  material_name: "",
  category: "",
  uom: "",
  current_quantity: 0,
};

export async function listRawMaterials(query: Request["query"]) {
  const { limit, offset, search, sort, order } = parsePagination(query);

  let where = "";
  const values: (string | number)[] = [];
  let idx = 1;

  if (search) {
    where = `WHERE material_id ILIKE $${idx} OR material_name ILIKE $${idx}`;
    values.push(`%${search}%`);
    idx++;
  }

  const sortColumn = ["material_id", "material_name", "category", "uom", "current_quantity", "created_at"].includes(sort as string)
    ? sort
    : "created_at";

  const countResult = await pool.query(
    `SELECT COUNT(*) FROM raw_materials ${where}`,
    values
  );
  const count = Number(countResult.rows[0].count);

  values.push(limit, offset);
  const result = await pool.query(
    `SELECT * FROM raw_materials
     ${where}
     ORDER BY ${sortColumn} ${order}
     LIMIT $${idx} OFFSET $${idx + 1}`,
    values
  );

  return { count, results: result.rows, limit, offset };
}

export async function getRawMaterialById(id: string) {
  const result = await pool.query("SELECT * FROM raw_materials WHERE id = $1", [
    id,
  ]);
  return result.rows[0] || null;
}

export async function createRawMaterial(data: {
  material_id: string;
  material_name: string;
  category: string;
  uom: string;
}) {
  const result = await pool.query(
    `INSERT INTO raw_materials (material_id, material_name, category, uom)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [data.material_id, data.material_name, data.category, data.uom]
  );
  return result.rows[0];
}

export async function updateRawMaterial(
  id: string,
  data: Partial<{
    material_id: string;
    material_name: string;
    category: string;
    uom: string;
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
    return getRawMaterialById(id);
  }

  values.push(id);
  const result = await pool.query(
    `UPDATE raw_materials SET ${fields.join(", ")}, updated_at = now()
     WHERE id = $${idx}
     RETURNING *`,
    values
  );
  return result.rows[0];
}

export async function deleteRawMaterial(id: string) {
  await pool.query("DELETE FROM raw_materials WHERE id = $1", [id]);
}

export async function adjustRawMaterialQuantity(
  client: DbClient,
  rawMaterialId: string,
  delta: number
) {
  const result = await client.query(
    `UPDATE raw_materials
     SET current_quantity = current_quantity + $1, updated_at = now()
     WHERE id = $2
     RETURNING *`,
    [delta, rawMaterialId]
  );
  return result.rows[0];
}

export async function bulkDeleteRawMaterials(ids: string[]) {
  await pool.query("DELETE FROM raw_materials WHERE id = ANY($1)", [ids]);
}
