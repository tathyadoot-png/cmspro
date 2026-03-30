import { Request, Response } from "express";
import authService from "./auth.service";

/* ✅ Helper: convert "7h" → milliseconds */
const parseExpiry = (value: string | undefined, fallbackHours = 7) => {
  if (!value) return fallbackHours * 60 * 60 * 1000;

  if (value.endsWith("h")) {
    return parseInt(value) * 60 * 60 * 1000;
  }

  if (value.endsWith("m")) {
    return parseInt(value) * 60 * 1000;
  }

  return fallbackHours * 60 * 60 * 1000;
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const { accessToken, refreshToken, user } =
      await authService.login(email, password);

    /* 🔥 FIXED COOKIE EXPIRY (SYNC WITH JWT) */

    const accessMaxAge = parseExpiry(process.env.JWT_ACCESS_EXPIRES, 7);
    const refreshMaxAge = 7 * 24 * 60 * 60 * 1000;

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: accessMaxAge, // ✅ अब 15 min नहीं → .env से control
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: refreshMaxAge,
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

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};