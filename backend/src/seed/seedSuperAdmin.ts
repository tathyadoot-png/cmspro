// backend/src/seed/seedSuperAdmin.ts

import Organization from "../models/organization/organization.model";
import Role from "../models/roles/role.model";
import User from "../models/users/user.model";
import bcrypt from "bcryptjs";

export const seedSuperAdmin = async () => {
  console.log("🔐 Checking Super Admin setup...");

  // 1️⃣ Ensure Organization exists
  let organization = await Organization.findOne({ shortCode: "SC" });

  if (!organization) {
    organization = await Organization.create({
      name: "The Sociyo Communication",
      shortCode: "SC",
      subscriptionPlan: "ENTERPRISE",
      isActive: true,
    });

    console.log("🏢 Organization created");
  } else {
    console.log("🏢 Organization already exists");
  }

  // 2️⃣ Get SUPER_ADMIN role
  const superAdminRole = await Role.findOne({ name: "SUPER_ADMIN" });

  if (!superAdminRole) {
    console.log("❌ SUPER_ADMIN role missing. Check role seeding.");
    return;
  }

  // 3️⃣ Check if super admin already exists
  const existingAdmin = await User.findOne({
    email: "admin@cms.com",
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    await User.create({
      name: "Super Admin",
      email: "admin@cms.com",
      password: hashedPassword,
      userCode: "SC0001",
      organizationId: organization._id,
      roles: [superAdminRole._id],
      isActive: true,
    });

    console.log("👑 Super Admin created");
    console.log("📧 Email: admin@cms.com");
    console.log("🔑 Password: Admin@123");
  } else {
    console.log("👑 Super Admin already exists");
  }
};