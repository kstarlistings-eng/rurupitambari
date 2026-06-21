import { Router } from "express";
import { getDashboardHandler } from "./dashboard.controller.js";
import { authenticate } from "../../middleware/auth.js";
import { requireRole } from "../../middleware/rbac.js";

const router = Router();

router.get(
  "/",
  authenticate,
  requireRole("admin_finance", "production_operator", "store_operator"),
  getDashboardHandler
);

export default router;
