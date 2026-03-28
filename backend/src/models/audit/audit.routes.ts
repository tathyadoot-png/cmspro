import { Router } from "express";
import { getTaskActivityController, getWorkshopActivityController } from "./audit.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requirePermission } from "../../middleware/permission.middleware";

const router = Router();

router.get(
  "/workshop/:id",
  authMiddleware,
  requirePermission("TASK_VIEW"),
  getWorkshopActivityController
);


router.get(
  "/task/:id",
  authMiddleware,
  requirePermission("TASK_VIEW"),
  getTaskActivityController
);

export default router;