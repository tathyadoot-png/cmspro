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

/* ===========================
   TASK CREATION
=========================== */
router.post(
  "/",
  authMiddleware,
  requirePermission("TASK_ASSIGN"),
  createTask
);

/* ===========================
   TASK FLOW
=========================== */

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

router.patch(
  "/:id/status",
  authMiddleware,
  requirePermission("TASK_START"),
  updateTaskStatus
);

/* ===========================
   FETCH
=========================== */

router.get(
  "/",
  authMiddleware,
  requirePermission("TASK_VIEW"),
  getTasks
);

router.get(
  "/:id",
  authMiddleware,
  requirePermission("TASK_VIEW"),
  getTask
);

export default router;