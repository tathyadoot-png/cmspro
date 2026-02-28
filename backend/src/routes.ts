// backend/src/routes.ts

import { Router } from "express";
import taskRoutes from "./models/tasks/task.routes";
import authRoutes from "./models/auth/auth.routes";
import userRoutes from "./models/users/user.routes";
import clientRoutes from "./models/clients/client.routes";
import projectRoutes from "./models/projects/project.routes";
import dashboardRoutes from "./models/dashboard/dashboard.routes";
import reassignmentRoutes from "./models/reassignment/reassignment.routes";

import escalationRoutes from "./models/escalation/escalation.routes";
import dashboardRiskRoutes from "./models/dashboard/dashboard.risk.routes";

const router = Router();


router.use("/dashboard", dashboardRiskRoutes);
router.use("/escalations", escalationRoutes);
router.use("/clients", clientRoutes);
router.use("/tasks", taskRoutes);
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/projects", projectRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/reassign", reassignmentRoutes);
export default router;