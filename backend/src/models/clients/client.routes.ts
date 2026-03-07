import { Router } from "express";
import { createClient, deleteClient, getClients, updateClient } from "./client.controller";
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


router.put(
 "/:id",
 authMiddleware,
 requirePermission("CLIENT_UPDATE"),
 updateClient
);

router.delete(
 "/:id",
 authMiddleware,
 requirePermission("CLIENT_DELETE"),
 deleteClient
);

export default router;