import { Request, Response } from "express";
import { getTeamAnalytics } from "./teamAnalytics.service";

export const fetchTeamAnalytics = async (
  req: Request,
  res: Response
) => {
  try {

    if (!req.user) {
      return res.status(401).json({
        success: false
      });
    }

    const data = await getTeamAnalytics(
      req.user.organizationId.toString()
    );

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
};