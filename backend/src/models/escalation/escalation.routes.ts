import { Router } from "express";
import { getEscalations } from "./escalation.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.get("/", authMiddleware, getEscalations);

export default router;