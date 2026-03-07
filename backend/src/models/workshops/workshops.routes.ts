import { Router } from "express";
import { createWorkshop, getWorkshops } from "./workshops.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requirePermission } from "../../middleware/permission.middleware";

const router = Router();

router.post(
  "/",
  authMiddleware,
  requirePermission("WORKSHOP_CREATE"),
  createWorkshop
);

router.get(
  "/",
  authMiddleware,
  requirePermission("WORKSHOP_VIEW"),
  getWorkshops
);

export default router;