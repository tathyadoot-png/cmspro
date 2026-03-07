import Task from "../models/tasks/task.model";
import mongoose from "mongoose";

export async function seedTasks(userId: string, orgId: string) {

  const tasks = [
    {
      title: "Demo Blog Writing",
      description: "Write SEO blog",
      assignedBy: userId,
      assignedTo: userId,
      organizationId: orgId,
      clientId: new mongoose.Types.ObjectId(),
      projectId: new mongoose.Types.ObjectId(),
      estimatedMinutes: 120,
      status: "ASSIGNED",
      priority: "MEDIUM",
      slaStatus: "SAFE"
    },
    {
      title: "Landing Page Content",
      description: "Write landing page",
      assignedBy: userId,
      assignedTo: userId,
      organizationId: orgId,
      clientId: new mongoose.Types.ObjectId(),
      projectId: new mongoose.Types.ObjectId(),
      estimatedMinutes: 60,
      status: "IN_PROGRESS",
      priority: "HIGH",
      slaStatus: "AT_RISK"
    },
    {
      title: "Client SEO Audit",
      description: "Audit website SEO",
      assignedBy: userId,
      assignedTo: userId,
      organizationId: orgId,
      clientId: new mongoose.Types.ObjectId(),
      projectId: new mongoose.Types.ObjectId(),
      estimatedMinutes: 90,
      status: "IN_REVIEW",
      priority: "HIGH",
      slaStatus: "OVERDUE"
    }
  ];

  await Task.insertMany(tasks);

  console.log("🌱 Demo tasks seeded");
}