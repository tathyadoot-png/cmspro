// backend/src/seed/seedRolesAndPermissions.ts

import Permission from "../models/roles/permission.model";
import Role from "../models/roles/role.model";

export const seedRolesAndPermissions = async () => {
  console.log("🌱 Seeding roles & permissions...");

  const permissionsList = [
    "USER_CREATE",
    "USER_DELETE",
    "USER_VIEW",
    "TASK_ASSIGN",
    "TASK_START",
    "TASK_SUBMIT",
    "TASK_APPROVE",
    "CLIENT_CREATE",
    "CLIENT_VIEW",
    "PROJECT_CREATE",
  ];

  const permissionDocs = [];

  for (const perm of permissionsList) {
    let permission = await Permission.findOne({ name: perm });

    if (!permission) {
      permission = await Permission.create({ name: perm });
    }

    permissionDocs.push(permission);
  }

  const roleConfigs = [
    {
      name: "SUPER_ADMIN",
      permissions: permissionsList,
    },
    {
      name: "ADMIN",
      permissions: [
        "USER_CREATE",
        "USER_VIEW",
        "TASK_ASSIGN",
        "TASK_APPROVE",
        "CLIENT_CREATE",
        "PROJECT_CREATE",
      ],
    },
    {
      name: "TL",
      permissions: [
        "TASK_ASSIGN",
        "TASK_APPROVE",
        "TASK_START",
        "TASK_SUBMIT",
      ],
    },
    {
      name: "WRITER",
      permissions: ["TASK_START", "TASK_SUBMIT"],
    },
  ];

  for (const roleConfig of roleConfigs) {
    let role = await Role.findOne({ name: roleConfig.name });

    const rolePermissions = permissionDocs
      .filter(p => roleConfig.permissions.includes(p.name))
      .map(p => p._id);

    if (!role) {
      await Role.create({
        name: roleConfig.name,
        permissions: rolePermissions,
      });
    }
  }

  console.log("✅ Seeding completed");
};