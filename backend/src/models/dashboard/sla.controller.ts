import { Request, Response } from "express";
import slaService from "./sla.service";

export const getSLAOverview = async (
  req: Request,
  res: Response
) => {
  try {

    if (!req.user)
      return res.status(401).json({ success: false });

    const data =
      await slaService.getSLAOverview(req.user);

    res.json({ success: true, data });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};