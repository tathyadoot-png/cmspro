import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { fetchTeamAnalytics } from "./teamAnalytics.controller";

const router = Router();

router.get(
  "/team",
  authMiddleware,
  fetchTeamAnalytics
);

export default router;