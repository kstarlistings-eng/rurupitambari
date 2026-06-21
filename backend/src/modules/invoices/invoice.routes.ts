import { Router } from "express";
import { listInvoicesHandler, getInvoiceHandler } from "./invoice.controller.js";
import { authenticate } from "../../middleware/auth.js";
import { requireRole } from "../../middleware/rbac.js";

const router = Router();

router.get(
  "/",
  authenticate,
  requireRole("admin_finance"),
  listInvoicesHandler
);
router.get(
  "/:id",
  authenticate,
  requireRole("admin_finance"),
  getInvoiceHandler
);

export default router;
