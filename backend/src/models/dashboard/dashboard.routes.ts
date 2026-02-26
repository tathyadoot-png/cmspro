import { Router } from "express";
import { getAdminDashboard } from "./dashboard.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requirePermission } from "../../middleware/permission.middleware";
import { getWorkload } from "./workload.controller";
import { getBurnoutStatus } from "./burnout.controller";
import {
  getWeeklyTrend,
  getMonthlyTrend,
} from "./trend.controller";


const router = Router();

router.get(
  "/admin",
  authMiddleware,
  requirePermission("USER_VIEW"),
  getAdminDashboard
);

router.get(
  "/workload",
  authMiddleware,
  requirePermission("USER_VIEW"),
  getWorkload
);


router.get(
  "/burnout",
  authMiddleware,
  requirePermission("USER_VIEW"),
  getBurnoutStatus
);

router.get(
  "/trend/weekly",
  authMiddleware,
  requirePermission("USER_VIEW"),
  getWeeklyTrend
);

router.get(
  "/trend/monthly",
  authMiddleware,
  requirePermission("USER_VIEW"),
  getMonthlyTrend
)

export default router;