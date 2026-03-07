import { Request, Response } from "express";
import authService from "./auth.service";

export const login = async (req: Request, res: Response) => {

  try {

    const { email, password } = req.body;

    const { accessToken, refreshToken, user } =
      await authService.login(email, password);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
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


export const getCurrentUser = async (req: Request, res: Response) => {

  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  res.json({
    success: true,
    user: req.user,
  });

};