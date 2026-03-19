import { Request, Response } from "express";
import ActivityLog from "../audit/activityLog.model";

export const getWorkshopActivity = async (req: Request, res: Response) => {
  try {

    if (!req.user) {
      return res.status(401).json({ success: false });
    }

    const workshopId = req.params.id;

    const activities = await ActivityLog.find({
      organizationId: req.user.organizationId,
      workshopId: workshopId,
    })
    .populate("userId", "name email userCode")
    .populate("targetId", "title status")
    .sort({ createdAt: -1 })
    .limit(20);

    res.json({
      success: true,
      data: activities
    });

  } catch (error: any) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};