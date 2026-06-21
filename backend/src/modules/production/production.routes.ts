import { Router } from "express";
import {
  listProductionOrdersHandler,
  getProductionOrderHandler,
  createProductionOrderHandler,
  updateProductionOrderHandler,
  deleteProductionOrderHandler,
} from "./production.controller.js";
import { authenticate } from "../../middleware/auth.js";
import { requireRole } from "../../middleware/rbac.js";

const router = Router();

router.get(
  "/",
  authenticate,
  requireRole("admin_finance", "production_operator"),
  listProductionOrdersHandler
);
router.get(
  "/:id",
  authenticate,
  requireRole("admin_finance", "production_operator"),
  getProductionOrderHandler
);
router.post(
  "/",
  authenticate,
  requireRole("admin_finance", "production_operator"),
  createProductionOrderHandler
);
router.patch(
  "/:id",
  authenticate,
  requireRole("admin_finance", "production_operator"),
  updateProductionOrderHandler
);
router.delete(
  "/:id",
  authenticate,
  requireRole("admin_finance"),
  deleteProductionOrderHandler
);

export default router;
