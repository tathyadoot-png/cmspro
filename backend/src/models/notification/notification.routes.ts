import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import Notification from "./notification.model";

const router = Router();

// 🔔 get my notifications
router.get("/", authMiddleware, async (req: any, res) => {
  const notifications = await Notification.find({
    userId: req.user._id,
  }).sort({ createdAt: -1 });

  res.json({
    success: true,
    data: notifications,
  });
});

// ✅ mark as read
router.patch("/:id/read", authMiddleware, async (req: any, res) => {
  await Notification.findByIdAndUpdate(req.params.id, {
    isRead: true,
  });

  res.json({ success: true });
});

router.patch("/mark-all-read", authMiddleware, async (req: any, res) => {
  await Notification.updateMany(
    { userId: req.user._id, isRead: false },
    { isRead: true }
  );

  res.json({ success: true });
});

export default router;