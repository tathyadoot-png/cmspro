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

// ▶ Start Task
router.patch(
  "/:id/start",
  authMiddleware,
  requirePermission("TASK_START"),
  startTask
);

// ▶ Submit Task
router.patch(
  "/:id/submit",
  authMiddleware,
  requirePermission("TASK_SUBMIT"),
  submitTask
);

// ▶ Approve Task
router.patch(
  "/:id/approve",
  authMiddleware,
  requirePermission("TASK_APPROVE"),
  approveTask
);

// ▶ Request Revision
router.patch(
  "/:id/revision",
  authMiddleware,
  requirePermission("TASK_APPROVE"),
  requestRevision
);

// ▶ Generic Status Update (dropdown वाला)
router.patch(
  "/:id/status",
  authMiddleware,
  requirePermission("TASK_START"),
  updateTaskStatus
);

/* ===========================
   TASK FETCH
=========================== */

// ▶ Get all tasks
router.get(
  "/",
  authMiddleware,
  requirePermission("TASK_VIEW"), // 🔥 ADD THIS (important)
  getTasks
);

// ▶ Get single task
router.get(
  "/:id",
  authMiddleware,
  requirePermission("TASK_VIEW"), // 🔥 ADD THIS
  getTask
);

export default router;