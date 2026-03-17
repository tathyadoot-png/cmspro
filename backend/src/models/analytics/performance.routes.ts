import { Router, Request, Response } from "express";
import PerformanceSnapshot from "./performanceSnapshot.model";
import { authMiddleware } from "../../middleware/auth.middleware";
import User from "../users/user.model";

const router = Router();

/*
-------------------------------------------------------
LEADERBOARD
GET /api/performance/leaderboard
-------------------------------------------------------
*/

router.get(
  "/leaderboard",
  authMiddleware,
  async (req: Request, res: Response) => {

    try {

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized"
        });
      }

      const data = await PerformanceSnapshot
        .find({
          organizationId: req.user.organizationId
        })
        .populate("userId", "name email")
        .sort({ performanceScore: -1 })
        .limit(10);

      res.json({
        success: true,
        data
      });

    } catch (error: any) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }

  }
);


/*
-------------------------------------------------------
GENERATE MONTHLY SNAPSHOT
POST /api/performance/generate-snapshot
-------------------------------------------------------
*/

router.post(
  "/generate-snapshot",
  authMiddleware,
  async (req: Request, res: Response) => {

    try {

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized"
        });
      }

      const users = await User.find({
        organizationId: req.user.organizationId
      });

      const now = new Date();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();

      const snapshots: any[] = [];

      for (const user of users) {

        const snapshot = await PerformanceSnapshot.create({

          organizationId: user.organizationId,
          userId: user._id,

          month,
          year,

          totalTasks: user.completedTasks + user.lateTasks,
          completedTasks: user.completedTasks,
          onTimeTasks: user.onTimeTasks,
          lateTasks: user.lateTasks,

          totalRevisions: user.totalRevisions,

          averageCompletionMinutes: user.averageCompletionMinutes,

          performanceScore: user.performanceScore,

          ratingTag: user.ratingTag,

          burnoutRisk:
            user.performanceScore < 40
              ? "HIGH"
              : user.performanceScore < 70
              ? "MEDIUM"
              : "LOW"

        });

        snapshots.push(snapshot);

      }

      res.json({
        success: true,
        message: "Performance snapshot generated",
        count: snapshots.length
      });

    } catch (error: any) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }

  }
);


/*
-------------------------------------------------------
MONTHLY ANALYTICS
GET /api/performance/monthly
-------------------------------------------------------
*/

router.get(
  "/monthly",
  authMiddleware,
  async (req: Request, res: Response) => {

    try {

      if (!req.user) {
        return res.status(401).json({
          success: false
        });
      }

      const data = await PerformanceSnapshot
        .find({
          organizationId: req.user.organizationId
        })
        .sort({ year: -1, month: -1 })
        .limit(12)
        .populate("userId", "name");

      res.json({
        success: true,
        data
      });

    } catch (error: any) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }

  }
);

export default router;