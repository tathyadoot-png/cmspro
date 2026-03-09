import { Router } from "express";
import { addMembers, createWorkshop, getWorkshopById, getWorkshops } from "./workshops.controller";
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

router.get(
"/:id",
authMiddleware,
requirePermission("WORKSHOP_VIEW"),
getWorkshopById
);

router.post(
"/:id/members",
authMiddleware,
requirePermission("WORKSHOP_UPDATE"),
addMembers
);


router.get(
  "/:id",
  authMiddleware,
  requirePermission("WORKSHOP_VIEW"),
  getWorkshopById
);
export default router;