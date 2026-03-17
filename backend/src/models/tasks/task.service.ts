import Task from "./task.model";
import { IUser } from "../users/user.model";
import { canTransition } from "../../utils/taskStateMachine";
import { calculateTaskTime } from "../../utils/timeCalculator";
import { logActivity } from "../activity/activity.service";
import User from "../users/user.model";
import {
  calculatePerformanceScore,
  getRatingTag,
} from "../../utils/calculatePerformance";
import { calculateSLAStatus } from "../../utils/slaPredictor";
import escalationService from "../escalation/escalation.service";
import { predictDeadlineRisk } from "../../utils/aiDeadlinePredictor";
import Workshop from "../workshops/workshops.model";

class TaskService {

  async createTask(data: any, currentUser: IUser) {

    const workshop = await Workshop.findOne({
      _id: data.workshopId,
      organizationId: currentUser.organizationId
    });

    if (!workshop)
      throw new Error("Workshop not found");

    const isAdmin = currentUser.roles?.some(
      (r: any) => r.name === "ADMIN" || r.name === "SUPER_ADMIN"
    );

    const isTL = workshop.teamLeads?.some(
      (tl: any) => tl.toString() === currentUser._id.toString()
    );

    if (!isAdmin && !isTL)
      throw new Error("Only workshop TL or Admin can assign tasks");

    const aiRisk = await predictDeadlineRisk(
      data.assignedTo,
      data.estimatedMinutes
    );

    const task = await Task.create({

      organizationId: currentUser.organizationId,

      clientId: workshop.clientId,

      workshopId: data.workshopId,

      title: data.title,

      description: data.description,

      assignedBy: currentUser._id,

      assignedTo: data.assignedTo,

      status: "ASSIGNED",

      priority: data.priority || "MEDIUM",

      estimatedMinutes: data.estimatedMinutes,

      slaStatus: "SAFE",

      aiRiskLevel: aiRisk,

      taskImages: data.taskImages || [],

      referenceLink: data.referenceLink || ""

    });

    await logActivity(
      task.organizationId.toString(),
      task.workshopId.toString(),
      currentUser._id.toString(),
      "TASK_CREATED",
      `${currentUser.name} created task "${task.title}"`,
      task._id.toString()
    );

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

    task.slaStatus = calculateSLAStatus(
      task.startedAt,
      task.estimatedMinutes,
      task.delayMinutes
    );

    await task.save();

    await logActivity(
      task.organizationId.toString(),
      task.workshopId.toString(),
      currentUser._id.toString(),
      "TASK_STARTED",
      `${currentUser.name} started task "${task.title}"`,
      task._id.toString()
    );

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

    const now = new Date();

    const { actualMinutes, delayMinutes } =
      calculateTaskTime(
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
      : "TEXT";

    task.slaStatus = calculateSLAStatus(
      task.startedAt,
      task.estimatedMinutes,
      task.delayMinutes
    );

    await task.save();

    if (task.slaStatus === "AT_RISK") {

      const alreadyEscalated =
        await escalationService.hasOpenEscalation(task._id);

      if (!alreadyEscalated) {
        await escalationService.createEscalation(
          task,
          "Task is at risk of deadline breach"
        );
      }
    }

    await logActivity(
      task.organizationId.toString(),
      task.workshopId.toString(),
      currentUser._id.toString(),
      "TASK_SUBMITTED",
      `${currentUser.name} submitted task "${task.title}"`,
      task._id.toString()
    );

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

    const workshop = await Workshop.findById(task.workshopId);

    const isAdmin = currentUser.roles?.some(
      (r: any) => r.name === "ADMIN" || r.name === "SUPER_ADMIN"
    );

    const isTL = workshop?.teamLeads?.some(
      (tl: any) => tl.toString() === currentUser._id.toString()
    );

    if (!isAdmin && !isTL)
      throw new Error("Only workshop TL or Admin can approve tasks");

    task.status = "APPROVED";
    task.completedAt = new Date();
    task.slaStatus =
      task.delayMinutes > 0 ? "OVERDUE" : "SAFE";

    await task.save();

    await logActivity(
      task.organizationId.toString(),
      task.workshopId.toString(),
      currentUser._id.toString(),
      "TASK_APPROVED",
      `${currentUser.name} approved task "${task.title}"`,
      task._id.toString()
    );

    if (task.delayMinutes > 0) {

      const alreadyEscalated =
        await escalationService.hasOpenEscalation(task._id);

      if (!alreadyEscalated) {
        await escalationService.createEscalation(
          task,
          "Task completed after deadline"
        );
      }
    }

    await this.updateUserPerformance(
      task.assignedTo.toString(),
      task
    );

    return task;
  }

  private async updateUserPerformance(userId: string, task: any) {

    const user = await User.findById(userId);
    if (!user) return;

    user.completedTasks += 1;

    if (task.delayMinutes <= 0)
      user.onTimeTasks += 1;
    else
      user.lateTasks += 1;

    const totalTime =
      user.averageCompletionMinutes *
      (user.completedTasks - 1) +
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

  async getTasks(currentUser: IUser, workshopId?: string) {

    const query: any = {
      organizationId: currentUser.organizationId
    };

    if (workshopId) {
      query.workshopId = workshopId;
    }

    return Task.find(query)
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

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

    await logActivity(
      task.organizationId.toString(),
      task.workshopId.toString(),
      currentUser._id.toString(),
      "REVISION_REQUESTED",
      `${currentUser.name} requested revision for "${task.title}"`,
      task._id.toString()
    );

    return task;
  }

  async updateTaskStatus(taskId: string, status: string, user: IUser) {

    const task = await Task.findOne({
      _id: taskId,
      organizationId: user.organizationId
    });

    if (!task) throw new Error("Task not found");

    task.status = status as any;

    await task.save();

    await logActivity(
      task.organizationId.toString(),
      task.workshopId.toString(),
      user._id.toString(),
      "TASK_STATUS_CHANGED",
      `${user.name} changed status of "${task.title}" to ${status}`,
      task._id.toString()
    );

    return task;
  }

  async getTask(taskId: string, currentUser: IUser) {

  const task = await Task.findOne({
    _id: taskId,
    organizationId: currentUser.organizationId
  })
  .populate("assignedTo","name email")
  .populate("assignedBy","name");

  if(!task)
    throw new Error("Task not found");

  return task;

}

}

export default new TaskService();