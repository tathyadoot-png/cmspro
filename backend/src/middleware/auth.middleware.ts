import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import User from "../models/users/user.model";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const decoded: any = verifyAccessToken(token);

const user = await User.findById(decoded.id)
  .populate({
    path: "roles",
    populate: {
      path: "permissions",
    },
  });    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};