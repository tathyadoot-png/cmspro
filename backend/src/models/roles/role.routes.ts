import { Router } from "express";
import Role from "./role.model";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

/* =========================
   GET ALL ROLES (WITH PERMISSIONS)
========================= */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const roles = await Role.find().populate("permissions", "name");

    res.json({
      success: true,
      data: roles,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch roles" });
  }
});

/* =========================
   CREATE ROLE
========================= */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, permissions } = req.body;

    const role = await Role.create({
      name,
      permissions,
    });

    const populatedRole = await role.populate("permissions", "name");

    res.json({
      success: true,
      data: populatedRole,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create role" });
  }
});

/* =========================
   UPDATE ROLE
========================= */
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { name, permissions } = req.body;

    const role = await Role.findByIdAndUpdate(
      req.params.id,
      { name, permissions },
      { new: true }
    ).populate("permissions", "name");

    res.json({
      success: true,
      data: role,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update role" });
  }
});

/* =========================
   DELETE ROLE
========================= */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Role.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete role" });
  }
});

export default router;  