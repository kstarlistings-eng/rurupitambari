import { Router } from "express";
import {
  listSalesDispatchesHandler,
  getSalesDispatchHandler,
  createSalesDispatchHandler,
  updateSalesDispatchHandler,
  deleteSalesDispatchHandler,
} from "./sales-dispatch.controller.js";
import { authenticate } from "../../middleware/auth.js";
import { requireRole } from "../../middleware/rbac.js";

const router = Router();

router.get(
  "/",
  authenticate,
  requireRole("admin_finance", "store_operator"),
  listSalesDispatchesHandler
);
router.get(
  "/:id",
  authenticate,
  requireRole("admin_finance", "store_operator"),
  getSalesDispatchHandler
);
router.post(
  "/",
  authenticate,
  requireRole("admin_finance", "store_operator"),
  createSalesDispatchHandler
);
router.patch(
  "/:id",
  authenticate,
  requireRole("admin_finance", "store_operator"),
  updateSalesDispatchHandler
);
router.delete(
  "/:id",
  authenticate,
  requireRole("admin_finance", "store_operator"),
  deleteSalesDispatchHandler
);

export default router;
