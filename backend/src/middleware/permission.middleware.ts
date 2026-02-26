import { Request, Response, NextFunction } from "express";

export const requirePermission = (permissionName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const roles = req.user.roles as any[];

    const hasPermission = roles.some((role: any) =>
      role.permissions.some(
        (perm: any) => perm.name === permissionName
      )
    );

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: "Forbidden - Missing Permission",
      });
    }

    next();
  };
};