import { Router } from "express";
import { createProject, getProjects } from "./project.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requirePermission } from "../../middleware/permission.middleware";

const router = Router();

router.post(
  "/",
  authMiddleware,
  requirePermission("PROJECT_CREATE"),
  createProject
);

router.get(
  "/",
  authMiddleware,
  requirePermission("PROJECT_CREATE"),
  getProjects
);

export default router;