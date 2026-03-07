import { Router } from "express";
import PerformanceSnapshot from "./performanceSnapshot.model";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.get(
  "/leaderboard",
  authMiddleware,
  async (req, res) => {

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const data = await PerformanceSnapshot
      .find({ organizationId: req.user.organizationId })
      .populate("userId", "name")
      .sort({ performanceScore: -1 })
      .limit(10);

    res.json({
      success: true,
      data
    });

  }
);

export default router;