import { Router } from "express";
import { getRiskDashboard } from "./dashboard.risk.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.get("/risk", authMiddleware, getRiskDashboard);

export default router;