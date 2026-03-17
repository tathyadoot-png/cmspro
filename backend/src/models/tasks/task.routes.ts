import { Router } from "express";
import {
  createTask,
  startTask,
  submitTask,
  approveTask,
  requestRevision,
  getTasks,
  updateTaskStatus,
  getTask
} from "./task.controller";

import { authMiddleware } from "../../middleware/auth.middleware";
import { requirePermission } from "../../middleware/permission.middleware";

const router = Router();

/* Create Task */

router.post(
  "/",
  authMiddleware,
  requirePermission("TASK_ASSIGN"),
  createTask
);

/* Start Task */

router.patch(
  "/:id/start",
  authMiddleware,
  requirePermission("TASK_START"),
  startTask
);

/* Submit Task */

router.patch(
  "/:id/submit",
  authMiddleware,
  requirePermission("TASK_SUBMIT"),
  submitTask
);

/* Approve Task */

router.patch(
  "/:id/approve",
  authMiddleware,
  requirePermission("TASK_APPROVE"),
  approveTask
);

/* Request Revision */

router.patch(
  "/:id/revision",
  authMiddleware,
  requirePermission("TASK_APPROVE"),
  requestRevision
);

/* Get All Tasks */

router.get(
  "/",
  authMiddleware,
  getTasks
);

/* 🔥 Get Single Task */

router.get(
  "/:id",
  authMiddleware,
  getTask
);

/* Update Task Status */

router.patch(
  "/:id/status",
  authMiddleware,
  updateTaskStatus
);

export default router;