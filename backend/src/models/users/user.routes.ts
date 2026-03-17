import { Router } from "express";
import {
  createUser,
  getUsers,
  updateUser,
  deleteUser
} from "./user.controller";

import { authMiddleware } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { fetchUserStats } from "./userStats.controller";

const router = Router();

router.post(
  "/",
  authMiddleware,
  requireRole(["SUPER_ADMIN","ADMIN"]),
  createUser
);

router.get(
  "/",
  authMiddleware,
  requireRole(["SUPER_ADMIN","ADMIN"]),
  getUsers
);

router.put(
  "/:id",
  authMiddleware,
  requireRole(["SUPER_ADMIN","ADMIN"]),
  updateUser
);

router.delete(
  "/:id",
  authMiddleware,
  requireRole(["SUPER_ADMIN","ADMIN"]),
  deleteUser
);

router.get(
  "/:userId/stats",
  authMiddleware,
  fetchUserStats
);

export default router;