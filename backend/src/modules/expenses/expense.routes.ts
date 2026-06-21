import { Router } from "express";
import {
  listExpensesHandler,
  createExpenseHandler,
  getExpenseHandler,
  updateExpenseHandler,
  deleteExpenseHandler,
} from "./expense.controller.js";
import { authenticate } from "../../middleware/auth.js";
import { requireRole } from "../../middleware/rbac.js";

const router = Router();

router.get(
  "/",
  authenticate,
  requireRole("admin_finance"),
  listExpensesHandler
);
router.post(
  "/",
  authenticate,
  requireRole("admin_finance"),
  createExpenseHandler
);
router.get(
  "/:id",
  authenticate,
  requireRole("admin_finance"),
  getExpenseHandler
);
router.patch(
  "/:id",
  authenticate,
  requireRole("admin_finance"),
  updateExpenseHandler
);
router.delete(
  "/:id",
  authenticate,
  requireRole("admin_finance"),
  deleteExpenseHandler
);

export default router;
