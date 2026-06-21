import { Router } from "express";
import {
  listSellersHandler,
  getSellerHandler,
  createSellerHandler,
  updateSellerHandler,
  deleteSellerHandler,
} from "./seller.controller.js";
import { authenticate } from "../../middleware/auth.js";
import { requireRole } from "../../middleware/rbac.js";

const router = Router();

router.get(
  "/",
  authenticate,
  requireRole("admin_finance", "store_operator"),
  listSellersHandler
);
router.get(
  "/:id",
  authenticate,
  requireRole("admin_finance", "store_operator"),
  getSellerHandler
);
router.post(
  "/",
  authenticate,
  requireRole("admin_finance", "store_operator"),
  createSellerHandler
);
router.patch(
  "/:id",
  authenticate,
  requireRole("admin_finance", "store_operator"),
  updateSellerHandler
);
router.delete(
  "/:id",
  authenticate,
  requireRole("admin_finance", "store_operator"),
  deleteSellerHandler
);

export default router;
