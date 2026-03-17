import { Router } from "express";
import Permission from "./permission.model";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.get("/", authMiddleware, async (req, res) => {
  const permissions = await Permission.find();

  res.json({
    success: true,
    data: permissions,
  });
});

export default router; 