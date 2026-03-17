// backend/src/models/auth/auth.routes.ts

import { Router } from "express";
import { getCurrentUser, login, logout } from "./auth.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.post("/login", login);
router.get("/me", authMiddleware, getCurrentUser);
router.post("/logout", logout);
export default router;