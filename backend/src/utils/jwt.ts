// backend/src/utils/jwt.ts

import jwt from "jsonwebtoken";

const accessSecret = process.env.JWT_ACCESS_SECRET;
const refreshSecret = process.env.JWT_REFRESH_SECRET;

if (!accessSecret || !refreshSecret) {
  throw new Error("JWT secrets are missing in .env");
}

export const generateAccessToken = (payload: object) => {
  return jwt.sign(
    payload,
    accessSecret,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRES || "15h",
    } as jwt.SignOptions
  );
};

export const generateRefreshToken = (payload: object) => {
  return jwt.sign(
    payload,
    refreshSecret,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES || "7d",
    } as jwt.SignOptions
  );
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, accessSecret);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, refreshSecret);
};