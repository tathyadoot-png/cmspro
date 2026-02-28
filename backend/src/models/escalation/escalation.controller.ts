import { Request, Response } from "express";
import escalationService from "./escalation.service";

export const getEscalations = async (
  req: Request,
  res: Response
) => {
  try {

    if (!req.user)
      return res.status(401).json({ success: false });

    const data =
      await escalationService.getOpenEscalations(
        req.user
      );

    res.json({ success: true, data });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};