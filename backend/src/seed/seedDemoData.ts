import bcrypt from "bcryptjs";

import Organization from "../models/organization/organization.model";
import User from "../models/users/user.model";
import Client from "../models/clients/client.model";
import Project from "../models/workshops/workshops.model";
import Task from "../models/tasks/task.model";
import Role from "../models/roles/role.model";

export const seedDemoData = async () => {

  console.log("🌱 Seeding demo data...");

  const org = await Organization.findOne();

  if (!org) {
    console.log("Organization not found");
    return;
  }

  const employeeRole = await Role.findOne({ name: "EMPLOYEE" });

  const password = await bcrypt.hash("123456", 10);

  /* USERS */
const existingUser = await User.findOne({ userCode: "EMP001" });

if (existingUser) {
  console.log("⚠️ Demo users already exist. Skipping seed.");
  return;
}
  const users = await User.insertMany([
    {
      name: "Rahul Sharma",
      email: "rahul@demo.com",
      password,
      userCode: "EMP001",
      organizationId: org._id,
      roles: [employeeRole?._id],
    },
    {
      name: "Anita Singh",
      email: "anita@demo.com",
      password,
      userCode: "EMP002",
      organizationId: org._id,
      roles: [employeeRole?._id],
    },
    {
      name: "Vikas Kumar",
      email: "vikas@demo.com",
      password,
      userCode: "EMP003",
      organizationId: org._id,
      roles: [employeeRole?._id],
    },
  ]);

  /* CLIENTS */

  const clients = await Client.insertMany([
    {
      name: "Acme Corp",
      clientType: "CORPORATE",
      organizationId: org._id,
      teamLeads: [users[0]._id],
    },
    {
      name: "Election Campaign",
      clientType: "POLITICAL",
      organizationId: org._id,
      teamLeads: [users[1]._id],
    },
  ]);

  /* PROJECTS */

  const projects = await Project.insertMany([
    {
      title: "Corporate Website Redesign",
      description: "Full redesign of corporate website",
      clientId: clients[0]._id,
      organizationId: org._id,
      status: "ACTIVE",
      priority: "HIGH",
      assignedTeam: "Content Team",
    },
    {
      title: "Election Social Media Campaign",
      description: "Social media content strategy",
      clientId: clients[1]._id,
      organizationId: org._id,
      status: "ACTIVE",
      priority: "URGENT",
      assignedTeam: "Political Team",
    },
  ]);

  /* TASKS */

  const slaStatuses = ["SAFE", "AT_RISK", "OVERDUE"] as const;

  const tasks = [];

  for (let i = 1; i <= 12; i++) {

    tasks.push({
      title: `Demo Task ${i}`,
      description: "Demo task for dashboard testing",

      organizationId: org._id,

      clientId: clients[i % clients.length]._id,
      projectId: projects[i % projects.length]._id,

      assignedBy: users[0]._id,
      assignedTo: users[i % users.length]._id,

      status: "IN_PROGRESS",

      priority: "MEDIUM",

      estimatedMinutes: 120,

      slaStatus: slaStatuses[i % 3],

      aiRiskLevel: "SAFE",

      actualMinutes: 0,
      delayMinutes: 0,
      revisionCount: 0,
    });

  }

  await Task.insertMany(tasks);

  console.log("✅ Demo data seeded");

};