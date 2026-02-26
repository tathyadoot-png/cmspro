// backend/src/models/auth/auth.controller.ts

import { Request, Response } from "express";
import authService from "./auth.service";

export const login = async (req: Request, res: Response) => {
  try {

    const { email, password } = req.body;

    const { accessToken, refreshToken, user } =
      await authService.login(email, password);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.json({
      success: true,
      user,
    });

  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};