import { Request, Response } from "express";
import dashboardService from "./dashboard.service";

export const getAdminDashboard = async (
  req: Request,
  res: Response
) => {
  try {

    if (!req.user)
      return res.status(401).json({ success: false });

    const data = await dashboardService.getAdminStats(
      req.user
    );

    res.json({
      success: true,
      data,
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};