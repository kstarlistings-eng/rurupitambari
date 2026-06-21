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

// CORS: allow the configured frontend URL in production, or any origin during
// local development. If FRONTEND_URL is not set we fall back to the permissive
// default to keep local development working.
const corsOrigin = env.FRONTEND_URL
  ? [env.FRONTEND_URL]
  : true;

app.use(cors({ origin: corsOrigin, credentials: true }));
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
