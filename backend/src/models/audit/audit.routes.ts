import { Router } from "express";
import { getWorkshopActivityController } from "./audit.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requirePermission } from "../../middleware/permission.middleware";

const router = Router();

router.get(
  "/workshop/:id",
  authMiddleware,
  requirePermission("TASK_VIEW"),
  getWorkshopActivityController
);

export default router;