// backend/src/modules/tasks/task.service.ts

import Task from "./task.model";
import { IUser } from "../users/user.model";
import { canTransition } from "../../utils/taskStateMachine";
import { calculateTaskTime } from "../../utils/timeCalculator";
import { logActivity } from "../audit/audit.service";
import User from "../users/user.model";
import { calculatePerformanceScore, getRatingTag } from "../../utils/calculatePerformance";

class TaskService {

  // ADD THIS METHOD ABOVE startTask()

  async createTask(data: any, currentUser: IUser) {

    const task = await Task.create({
      organizationId: currentUser.organizationId,
      clientId: data.clientId,
      projectId: data.projectId,

      title: data.title,
      description: data.description,

      assignedBy: currentUser._id,
      assignedTo: data.assignedTo,

      status: "ASSIGNED",
      priority: data.priority || "MEDIUM",

      estimatedMinutes: data.estimatedMinutes,
    });

    return task;
  }


  async startTask(taskId: string, currentUser: IUser) {
    const task = await Task.findOne({
      _id: taskId,
      organizationId: currentUser.organizationId,
    });
    if (!task) throw new Error("Task not found");

    if (!task.assignedTo.equals(currentUser._id))
      throw new Error("Unauthorized");

    if (!canTransition(task.status, "IN_PROGRESS"))
      throw new Error("Invalid state transition");

    task.status = "IN_PROGRESS";
    task.startedAt = new Date();

    await task.save();

    await logActivity({
      organizationId: task.organizationId,
      userId: currentUser._id,
      actionType: "TASK_STARTED",
      targetType: "TASK",
      targetId: task._id,
    });

    return task;
  }

  async submitTask(taskId: string, submissionData: string, currentUser: IUser) {
    const task = await Task.findOne({
      _id: taskId,
      organizationId: currentUser.organizationId,
    });
    if (!task) throw new Error("Task not found");

    if (!task.assignedTo.equals(currentUser._id))
      throw new Error("Unauthorized");

    if (!canTransition(task.status, "IN_REVIEW"))
      throw new Error("Invalid state transition");

    if (!task.startedAt)
      throw new Error("Task not started");
    if (task.status !== "IN_PROGRESS")
      throw new Error("Task must be in progress");
    const now = new Date();

    const { actualMinutes, delayMinutes } = calculateTaskTime(
      task.startedAt,
      now,
      task.estimatedMinutes
    );

    task.status = "IN_REVIEW";
    task.submittedAt = now;
    task.actualMinutes = actualMinutes;
    task.delayMinutes = delayMinutes;
    task.submissionData = submissionData;
    task.submissionType = submissionData?.startsWith("http")
      ? "LINK"
      : "TEXT"; // basic detection (improve later)
    await task.save();

    await logActivity({
      organizationId: task.organizationId,
      userId: currentUser._id,
      actionType: "TASK_SUBMITTED",
      targetType: "TASK",
      targetId: task._id,
    });

    return task;
  }

  async approveTask(taskId: string, currentUser: IUser) {
    const task = await Task.findOne({
      _id: taskId,
      organizationId: currentUser.organizationId,
    });
    if (!task) throw new Error("Task not found");

    if (!canTransition(task.status, "APPROVED"))
      throw new Error("Invalid state transition");
    if (!currentUser.roles.some((role: any) =>
      role.name === "ADMIN" || role.name === "TL"
    )) {
      throw new Error("Not authorized to approve");
    }
    task.status = "APPROVED";
    task.completedAt = new Date();

    await task.save();

    await this.updateUserPerformance(task.assignedTo.toString(), task);

    await logActivity({
      organizationId: task.organizationId,
      userId: currentUser._id,
      actionType: "TASK_APPROVED",
      targetType: "TASK",
      targetId: task._id,
    });

    return task;
  }



  async requestRevision(taskId: string, currentUser: IUser) {

    const task = await Task.findOne({
      _id: taskId,
      organizationId: currentUser.organizationId,
    });

    if (!task) throw new Error("Task not found");

    if (!canTransition(task.status, "CHANGES_REQUESTED"))
      throw new Error("Invalid state transition");

    task.status = "CHANGES_REQUESTED";
    task.revisionCount += 1;

    await task.save();

    return task;
  }




  private async updateUserPerformance(userId: string, task: any) {
    const user = await User.findById(userId);
    if (!user) return;

    user.completedTasks += 1;

    if (task.delayMinutes <= 0) {
      user.onTimeTasks += 1;
    } else {
      user.lateTasks += 1;
    }

    // Average calculation
    const totalTime =
      user.averageCompletionMinutes * (user.completedTasks - 1) +
      task.actualMinutes;

    user.averageCompletionMinutes =
      Math.round(totalTime / user.completedTasks);

    const score = calculatePerformanceScore({
      completedTasks: user.completedTasks,
      onTimeTasks: user.onTimeTasks,
      lateTasks: user.lateTasks,
      totalRevisions: user.totalRevisions,
    });

    user.performanceScore = score;
    user.ratingTag = getRatingTag(score);

    await user.save();
  }
}

export default new TaskService();