import { Router } from "express";
import {
  createUser,
  getUsers,
  updateUser,
  deleteUser
} from "./user.controller";

import { authMiddleware } from "../../middleware/auth.middleware";
import { requirePermission } from "../../middleware/permission.middleware";
import { fetchUserStats } from "./userStats.controller";

const router = Router();

/* ===========================
   USER MANAGEMENT
=========================== */

// ▶ Create User
router.post(
  "/",
  authMiddleware,
  requirePermission("USER_CREATE"),
  createUser
);

// ▶ Get All Users
router.get(
  "/",
  authMiddleware,
  requirePermission("USER_VIEW"),
  getUsers
);

// ▶ Update User
router.put(
  "/:id",
  authMiddleware,
  requirePermission("USER_UPDATE"),
  updateUser
);

// ▶ Delete User
router.delete(
  "/:id",
  authMiddleware,
  requirePermission("USER_DELETE"),
  deleteUser
);

/* ===========================
   USER ANALYTICS
=========================== */

// ▶ User Stats
router.get(
  "/:userId/stats",
  authMiddleware,
  requirePermission("USER_VIEW"),
  fetchUserStats
);

export default router;