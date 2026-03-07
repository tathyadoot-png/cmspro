import { Router } from "express";
import {
  createTask,
  startTask,
  submitTask,
  approveTask,
  requestRevision,
    getTasks,
    updateTaskStatus
} from "./task.controller";

import { authMiddleware } from "../../middleware/auth.middleware";
import { requirePermission } from "../../middleware/permission.middleware";

const router = Router();

router.post(
  "/",
  authMiddleware,
  requirePermission("TASK_ASSIGN"),
  createTask
);

router.patch(
  "/:id/start",
  authMiddleware,
  requirePermission("TASK_START"),
  startTask
);

router.patch(
  "/:id/submit",
  authMiddleware,
  requirePermission("TASK_SUBMIT"),
  submitTask
);

router.patch(
  "/:id/approve",
  authMiddleware,
  requirePermission("TASK_APPROVE"),
  approveTask
);

router.patch(
  "/:id/revision",
  authMiddleware,
  requirePermission("TASK_APPROVE"),
  requestRevision
);

// router.get(
//   "/",
//   authMiddleware,
//   requirePermission("TASK_VIEW"),
//   getTasks
// );

router.get(
  "/",
  authMiddleware,
  getTasks
);

router.patch(
  "/:id/status",
  authMiddleware,
  updateTaskStatus
);
export default router;