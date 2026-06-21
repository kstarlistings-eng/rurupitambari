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
  requireRole("admin_finance"),
  listSellersHandler
);
router.get(
  "/:id",
  authenticate,
  requireRole("admin_finance"),
  getSellerHandler
);
router.post(
  "/",
  authenticate,
  requireRole("admin_finance"),
  createSellerHandler
);
router.patch(
  "/:id",
  authenticate,
  requireRole("admin_finance"),
  updateSellerHandler
);
router.delete(
  "/:id",
  authenticate,
  requireRole("admin_finance"),
  deleteSellerHandler
);

export default router;
