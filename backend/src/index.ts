import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/users/user.routes.js";
import rawMaterialRoutes from "./modules/raw-materials/raw-material.routes.js";
import expenseRoutes from "./modules/expenses/expense.routes.js";
import productionRoutes from "./modules/production/production.routes.js";
import transferRoutes from "./modules/transfers/transfer.routes.js";
import finishedGoodRoutes from "./modules/finished-goods/finished-good.routes.js";
import sellerRoutes from "./modules/sellers/seller.routes.js";
import salesDispatchRoutes from "./modules/sales-dispatch/sales-dispatch.routes.js";
import invoiceRoutes from "./modules/invoices/invoice.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";

const app = express();

// CORS: allow the configured frontend URL(s) in production, or any origin during
// local development. FRONTEND_URL can be a single URL or a comma-separated list.
// Trailing slashes are stripped so "https://example.com/" matches the request
// origin "https://example.com".
function parseCorsOrigins(value: string | undefined): string[] | boolean {
  if (!value || value.trim() === "") {
    return true; // allow any origin (safe only for local dev)
  }

  const origins = value
    .split(",")
    .map((url) => url.trim().replace(/\/$/, ""))
    .filter(Boolean);

  return origins.length > 0 ? origins : true;
}

const corsOrigins = parseCorsOrigins(env.FRONTEND_URL);

app.use(cors({ origin: corsOrigins, credentials: true }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/raw-materials", rawMaterialRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/production-orders", productionRoutes);
app.use("/api/transfers", transferRoutes);
app.use("/api/finished-goods", finishedGoodRoutes);
app.use("/api/sellers", sellerRoutes);
app.use("/api/sales-dispatches", salesDispatchRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(errorHandler);

const PORT = Number(env.PORT);

// Start the HTTP server when running locally. When deployed to Vercel the
// platform handles the server and imports the exported `app` instead.
if (process.env.VERCEL !== "1") {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
