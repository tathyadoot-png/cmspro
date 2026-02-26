import { Request, Response } from "express";
import workloadService from "./workload.service";

export const getWorkload = async (
  req: Request,
  res: Response
) => {
  try {

    if (!req.user)
      return res.status(401).json({ success: false });

    const data =
      await workloadService.getWorkloadDistribution(
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