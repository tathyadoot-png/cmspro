import { Request, Response } from "express";
import performanceService from "./performance.service";

export const getWorkshopPerformance = async (req: Request, res: Response) => {

  try {

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const workshopId = req.params.id;

    const data = await performanceService.getWorkshopPerformance(
      workshopId as string,
      req.user
    );

    res.json({
      success: true,
      data
    });

  } catch (error: any) {

    res.status(400).json({
      success: false,
      message: error.message
    });

  }

};