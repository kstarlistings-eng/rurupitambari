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
  requireRole("admin_finance"),
  listSalesDispatchesHandler
);
router.get(
  "/:id",
  authenticate,
  requireRole("admin_finance"),
  getSalesDispatchHandler
);
router.post(
  "/",
  authenticate,
  requireRole("admin_finance"),
  createSalesDispatchHandler
);
router.patch(
  "/:id",
  authenticate,
  requireRole("admin_finance"),
  updateSalesDispatchHandler
);
router.delete(
  "/:id",
  authenticate,
  requireRole("admin_finance"),
  deleteSalesDispatchHandler
);

export default router;
