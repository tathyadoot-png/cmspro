import { Request, Response } from "express";
import burnoutService from "./burnout.service";

export const getBurnoutStatus = async (
  req: Request,
  res: Response
) => {
  try {

    if (!req.user)
      return res.status(401).json({ success: false });

    const data =
      await burnoutService.detectBurnout(req.user);

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