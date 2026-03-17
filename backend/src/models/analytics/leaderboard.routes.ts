import { Router, Request, Response } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import User from "../users/user.model";

const router = Router();

/*
-----------------------------------
LIVE LEADERBOARD
-----------------------------------
*/

router.get(
  "/leaderboard",
  authMiddleware,
  async (req: Request, res: Response) => {

    try {

      if (!req.user) {
        return res.status(401).json({
          success:false
        });
      }

      const users = await User.find({
        organizationId: req.user.organizationId
      })
      .select(
        "name email performanceScore ratingTag completedTasks lateTasks"
      )
      .sort({ performanceScore:-1 })
      .limit(10);

      res.json({
        success:true,
        data:users
      });

    } catch(error:any){

      res.status(500).json({
        success:false,
        message:error.message
      });

    }

  }
);

export default router;