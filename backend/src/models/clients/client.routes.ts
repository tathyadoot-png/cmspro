import { Router } from "express";
import { createClient, getClients } from "./client.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requirePermission } from "../../middleware/permission.middleware";

const router = Router();

router.post(
  "/",
  authMiddleware,
  requirePermission("CLIENT_CREATE"),
  createClient
);

router.get(
  "/",
  authMiddleware,
  requirePermission("CLIENT_VIEW"),
  getClients
);

export default router;