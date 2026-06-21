import { pool } from "../../config/db.js";

export async function getDashboardData() {
  const [
    rawMaterialsResult,
    expensesResult,
    productionResult,
    pendingTransfersResult,
    finishedGoodsResult,
    sellersResult,
    salesDispatchResult,
    invoicesResult,
    recentExpensesResult,
    recentProductionResult,
    recentSalesResult,
    monthlySalesResult,
    monthlyExpensesResult,
  ] = await Promise.all([
    pool.query("SELECT COUNT(*) as count, COALESCE(SUM(current_quantity), 0) as total_quantity FROM raw_materials"),
    pool.query("SELECT COUNT(*) as count, COALESCE(SUM(total_cost), 0) as total_value FROM expenses"),
    pool.query("SELECT COUNT(*) as count, COALESCE(SUM(quantity_produced), 0) as total_quantity FROM production_orders"),
    pool.query("SELECT COUNT(*) as count FROM transfers WHERE status = 'pending'"),
    pool.query("SELECT COUNT(*) as count, COALESCE(SUM(quantity_available), 0) as total_quantity FROM finished_goods"),
    pool.query("SELECT COUNT(*) as count FROM sellers WHERE is_active = true"),
    pool.query("SELECT COUNT(*) as count, COALESCE(SUM(quantity_allocated * selling_price_per_unit), 0) as total_value FROM sales_dispatches"),
    pool.query("SELECT COUNT(*) as count, COALESCE(SUM(total_amount), 0) as total_value FROM invoices"),
    pool.query(`
      SELECT e.*, rm.material_name
      FROM expenses e
      JOIN raw_materials rm ON e.raw_material_id = rm.id
      ORDER BY e.created_at DESC
      LIMIT 5
    `),
    pool.query(`
      SELECT po.*
      FROM production_orders po
      ORDER BY po.created_at DESC
      LIMIT 5
    `),
    pool.query(`
      SELECT sd.*, s.name as seller_name, fg.product_name
      FROM sales_dispatches sd
      JOIN sellers s ON sd.seller_id = s.id
      JOIN finished_goods fg ON sd.finished_good_id = fg.id
      ORDER BY sd.created_at DESC
      LIMIT 5
    `),
    pool.query(`
      SELECT DATE_TRUNC('month', created_at) as month, COALESCE(SUM(total_amount), 0) as total
      FROM invoices
      WHERE created_at >= NOW() - INTERVAL '6 months'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month ASC
    `),
    pool.query(`
      SELECT DATE_TRUNC('month', created_at) as month, COALESCE(SUM(total_cost), 0) as total
      FROM expenses
      WHERE created_at >= NOW() - INTERVAL '6 months'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month ASC
    `),
  ]);

  return {
    stats: {
      raw_materials: {
        count: Number(rawMaterialsResult.rows[0].count),
        total_quantity: Number(rawMaterialsResult.rows[0].total_quantity),
      },
      expenses: {
        count: Number(expensesResult.rows[0].count),
        total_value: Number(expensesResult.rows[0].total_value),
      },
      production: {
        count: Number(productionResult.rows[0].count),
        total_quantity: Number(productionResult.rows[0].total_quantity),
      },
      pending_transfers: {
        count: Number(pendingTransfersResult.rows[0].count),
      },
      finished_goods: {
        count: Number(finishedGoodsResult.rows[0].count),
        total_quantity: Number(finishedGoodsResult.rows[0].total_quantity),
      },
      sellers: {
        count: Number(sellersResult.rows[0].count),
      },
      sales_dispatches: {
        count: Number(salesDispatchResult.rows[0].count),
        total_value: Number(salesDispatchResult.rows[0].total_value),
      },
      invoices: {
        count: Number(invoicesResult.rows[0].count),
        total_value: Number(invoicesResult.rows[0].total_value),
      },
    },
    recent: {
      expenses: recentExpensesResult.rows,
      production: recentProductionResult.rows,
      sales: recentSalesResult.rows,
    },
    charts: {
      monthly_sales: monthlySalesResult.rows.map((row) => ({
        month: row.month,
        total: Number(row.total),
      })),
      monthly_expenses: monthlyExpensesResult.rows.map((row) => ({
        month: row.month,
        total: Number(row.total),
      })),
    },
  };
}
