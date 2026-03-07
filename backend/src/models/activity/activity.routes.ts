import express from "express";
import Activity from "../activity/activity.model";

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

export default router;