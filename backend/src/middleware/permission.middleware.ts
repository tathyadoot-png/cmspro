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

    // ✅ SUPER ADMIN bypass
    if (roles.some(r => r.name === "SUPER_ADMIN")) {
      return next();
    }

    // ✅ permission check
    const hasPermission = roles.some(role =>
      role.permissions?.some((p: any) => p.name === permissionName)
    );

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: "Forbidden - Missing Permission",
      });
    }
// console.log(
//   req.user.roles.map((r: any) => ({
//     role: r.name,
//     permissions: r.permissions.map((p: any) => p.name)
//   }))
// );
    next();
  };
};