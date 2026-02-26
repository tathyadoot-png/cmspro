// backend/src/routes.ts

import { Router } from "express";
import taskRoutes from "./models/tasks/task.routes";
import authRoutes from "./models/auth/auth.routes";
import userRoutes from "./models/users/user.routes";
import clientRoutes from "./models/clients/client.routes";
import projectRoutes from "./models/projects/project.routes";
import dashboardRoutes from "./models/dashboard/dashboard.routes";


const router = Router();



router.use("/clients", clientRoutes);
router.use("/tasks", taskRoutes);
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/projects", projectRoutes);
router.use("/dashboard", dashboardRoutes);
export default router;