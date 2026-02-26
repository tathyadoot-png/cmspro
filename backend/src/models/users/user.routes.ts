// backend/src/models/users/user.routes.ts

import { Router } from "express";
import { createUser } from "./user.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";

const router = Router();

router.post(
  "/",
  authMiddleware,
  requireRole(["SUPER_ADMIN", "ADMIN"]),
  createUser
);

export default router;