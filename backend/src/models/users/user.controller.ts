// backend/src/models/users/user.controller.ts

import { Request, Response } from "express";
import userService from "./user.service";

export const createUser = async (req: Request, res: Response) => {
  try {

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await userService.createUser(
      req.body,
      req.user
    );

    res.status(201).json({
      success: true,
      data: user,
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};