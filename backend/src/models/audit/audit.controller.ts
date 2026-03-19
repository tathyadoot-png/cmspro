import { Request, Response } from "express";
import { getWorkshopActivity } from "./audit.service";

export const fetchWorkshopActivity = async (
  req: Request,
  res: Response
) => {

  try {

    if (!req.user)
      return res.status(401).json({ success: false });

    const activity = await getWorkshopActivity(
      req.params.id as string,
      req.user
    );

    res.json({
      success: true,
      data: activity,
    });

  } catch (error: any) {

    res.status(400).json({
      success: false,
      message: error.message,
    });

  }

};

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