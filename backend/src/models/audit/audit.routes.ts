import { Router } from "express";
import { fetchWorkshopActivity } from "./audit.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.get(
  "/workshop/:id",
  authMiddleware,
  fetchWorkshopActivity
);

export default router;