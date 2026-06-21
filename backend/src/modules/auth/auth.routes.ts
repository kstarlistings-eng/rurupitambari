import { Router } from "express";
import { loginHandler, refreshHandler, meHandler } from "./auth.controller.js";
import { authenticate } from "../../middleware/auth.js";

const router = Router();

router.post("/login", loginHandler);
router.post("/refresh", refreshHandler);
router.get("/me", authenticate, meHandler);

export default router;
