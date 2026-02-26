// backend/src/middleware/role.middleware.ts

import { Request, Response, NextFunction } from "express";

export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // because roles are populated
    const roles = req.user.roles as any[];

    const hasRole = roles.some((role: any) =>
      allowedRoles.includes(role.name)
    );

    if (!hasRole) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    next();
  };
};