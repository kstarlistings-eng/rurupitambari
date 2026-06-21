import { Router } from "express";
import {
  listRawMaterialsHandler,
  getRawMaterialHandler,
  createRawMaterialHandler,
  updateRawMaterialHandler,
  deleteRawMaterialHandler,
  bulkDeleteRawMaterialsHandler,
} from "./raw-material.controller.js";
import { authenticate } from "../../middleware/auth.js";
import { requireRole } from "../../middleware/rbac.js";

const router = Router();

router.get(
  "/",
  authenticate,
  requireRole("admin_finance", "production_operator"),
  listRawMaterialsHandler
);
router.get(
  "/:id",
  authenticate,
  requireRole("admin_finance", "production_operator"),
  getRawMaterialHandler
);
router.post(
  "/",
  authenticate,
  requireRole("admin_finance"),
  createRawMaterialHandler
);
router.patch(
  "/:id",
  authenticate,
  requireRole("admin_finance"),
  updateRawMaterialHandler
);
router.delete(
  "/:id",
  authenticate,
  requireRole("admin_finance"),
  deleteRawMaterialHandler
);
router.post(
  "/bulk-delete/",
  authenticate,
  requireRole("admin_finance"),
  bulkDeleteRawMaterialsHandler
);

export default router;
