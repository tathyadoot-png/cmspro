import { Request, Response } from "express";
import { getWorkshopActivity } from "./audit.service";
import { getTaskActivity } from "./audit.service";

export const getWorkshopActivityController = async (req: any, res: any) => {
  try {

    const workshopId = req.params.id;

    const activities = await getWorkshopActivity(
      workshopId,
      req.user
    );

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

export const getTaskActivityController = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const taskId = req.params.id;

    const activity = await getTaskActivity(
      taskId as string,
      req.user
    );

    res.json({
      success: true,
      data: activity,
    });

  } catch (error: any) {
    console.error("❌ TASK ACTIVITY ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch task activity",
    });
  }
};