import { Router } from "express";
import { autoReassign } from "./reassignment.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.patch("/:id/auto", authMiddleware, autoReassign);

export default router;