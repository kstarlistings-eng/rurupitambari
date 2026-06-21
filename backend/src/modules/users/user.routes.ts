import { Router } from "express";
import { listUsersHandler } from "./user.controller.js";
import { authenticate } from "../../middleware/auth.js";
import { requireRole } from "../../middleware/rbac.js";

const router = Router();

router.get(
  "/",
  authenticate,
  requireRole("admin_finance"),
  listUsersHandler
);

export default router;
