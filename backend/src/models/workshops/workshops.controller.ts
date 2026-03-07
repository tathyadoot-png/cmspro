import { Request, Response } from "express";
import workshopService from "./workshops.service";

export const createWorkshop = async (req: Request, res: Response) => {
  try {

    if (!req.user)
      return res.status(401).json({ success: false });

    const workshop = await workshopService.createWorkshop(
      req.body,
      req.user
    );

    res.status(201).json({
      success: true,
      data: workshop,
    });

  } catch (error: any) {

    res.status(400).json({
      success: false,
      message: error.message,
    });

  }
};

export const getWorkshops = async (req: Request, res: Response) => {

  try {

    if (!req.user)
      return res.status(401).json({ success: false });

    const workshops = await workshopService.getWorkshops(req.user);

    res.json({
      success: true,
      data: workshops,
    });

  } catch (error: any) {

    res.status(400).json({
      success: false,
      message: error.message,
    });

  }

};