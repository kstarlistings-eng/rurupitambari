import { Router } from "express";
import {
  listFinishedGoodsHandler,
  getFinishedGoodHandler,
} from "./finished-good.controller.js";
import { authenticate } from "../../middleware/auth.js";
import { requireRole } from "../../middleware/rbac.js";

const router = Router();

router.get(
  "/",
  authenticate,
  requireRole("admin_finance", "store_operator"),
  listFinishedGoodsHandler
);
router.get(
  "/:id",
  authenticate,
  requireRole("admin_finance", "store_operator"),
  getFinishedGoodHandler
);

export default router;
