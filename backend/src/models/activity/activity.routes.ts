import express from "express";
import Activity from "./activity.model";
import { getWorkshopActivity } from "./activity.controller";
import { requirePermission } from "../../middleware/permission.middleware";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = express.Router();

router.get("/", async (req, res) => {

  const activities = await Activity
    .find()
    .populate("userId", "name")
    .sort({ createdAt: -1 })
    .limit(20);

  res.json({
    success: true,
    data: activities
  });

});

router.get(
  "/workshop/:id",
  authMiddleware,
  requirePermission("TASK_VIEW"),
  getWorkshopActivity
);

export default router;