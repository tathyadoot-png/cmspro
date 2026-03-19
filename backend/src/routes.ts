// backend/src/routes.ts

import { Router } from "express";
import taskRoutes from "./models/tasks/task.routes";
import authRoutes from "./models/auth/auth.routes";
import userRoutes from "./models/users/user.routes";
import clientRoutes from "./models/clients/client.routes";
import projectRoutes from "./models/workshops/workshops.routes";
import dashboardRoutes from "./models/dashboard/dashboard.routes";
import reassignmentRoutes from "./models/reassignment/reassignment.routes";
import activityRoutes from "./models/activity/activity.routes";
import escalationRoutes from "./models/escalation/escalation.routes";
import dashboardRiskRoutes from "./models/dashboard/dashboard.risk.routes";
import roleRoutes from "./models/roles/role.routes";
import performanceRoutes from "./models/analytics/performance.routes";
import workshopRoutes from "./models/workshops/workshops.routes";
import auditRoutes from "./models/audit/audit.routes";
import messageRoutes from "./models/messages/messages.routes";
import uploadRoutes from "./modules/upload/upload.routes";
import taskCommentRoutes from "./models/taskComments/taskComment.routes";
import leaderboardRoutes from "./models/analytics/leaderboard.routes";
import teamAnalyticsRoutes from "./models/analytics/teamAnalytics.routes";

import permissionRoutes from "./models/roles/permission.routes";
import performanceRoutess from "./models/performance/performance.routes";

const router = Router();


router.use("/performancee", performanceRoutess); //njhfc
router.use("/permissions", permissionRoutes);

router.use("/analytics", teamAnalyticsRoutes);
router.use("/analytics", leaderboardRoutes);
router.use("/task-comments", taskCommentRoutes);
router.use("/performance", performanceRoutes);

router.use("/dashboard", dashboardRiskRoutes);
router.use("/escalations", escalationRoutes);
router.use("/clients", clientRoutes);
router.use("/tasks", taskRoutes);
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/projects", projectRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/reassign", reassignmentRoutes);
router.use("/activity", activityRoutes); //lite
router.use("/roles", roleRoutes);
router.use("/workshops", workshopRoutes);
router.use("/audit", auditRoutes);
router.use("/messages", messageRoutes);
router.use("/upload",uploadRoutes);
export default router;