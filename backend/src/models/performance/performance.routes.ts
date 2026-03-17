import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { getWorkshopPerformance } from "./performance.controller";

const router = Router();

router.get(
  "/workshop/:id",
  authMiddleware,
  getWorkshopPerformance
);

export default router;