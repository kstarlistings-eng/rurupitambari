import { Router } from "express";
import {
  listTransfersHandler,
  getTransferHandler,
  receiveTransferHandler,
} from "./transfer.controller.js";
import { authenticate } from "../../middleware/auth.js";
import { requireRole } from "../../middleware/rbac.js";

const router = Router();

router.get(
  "/",
  authenticate,
  requireRole("admin_finance", "production_operator", "store_operator"),
  listTransfersHandler
);
router.get(
  "/:id",
  authenticate,
  requireRole("admin_finance", "production_operator", "store_operator"),
  getTransferHandler
);
router.patch(
  "/:id/receive",
  authenticate,
  requireRole("admin_finance", "store_operator"),
  receiveTransferHandler
);

export default router;
