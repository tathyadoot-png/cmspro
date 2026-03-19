import Task from "./task.model";
import { IUser } from "../users/user.model";
import { canTransition } from "../../utils/taskStateMachine";
import { calculateTaskTime } from "../../utils/timeCalculator";
import { logActivity } from "../audit/audit.service";
import User from "../users/user.model";
import {
  calculatePerformanceScore,
  getRatingTag,
} from "../../utils/calculatePerformance";
import { calculateSLAStatus } from "../../utils/slaPredictor";
import escalationService from "../escalation/escalation.service";
import { predictDeadlineRisk } from "../../utils/aiDeadlinePredictor";
import Workshop from "../workshops/workshops.model";
import TimeLog from "../timeLogs/timeLog.model";
import { TaskStatus } from "./task.model";
class TaskService {

  async createTask(data: any, currentUser: IUser) {

    const workshop = await Workshop.findOne({
      _id: data.workshopId,
      organizationId: currentUser.organizationId
    });

    if (!workshop) throw new Error("Workshop not found");

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
      aiRiskLevel: aiRisk,
      taskImages: data.taskImages || [],
      referenceLink: data.referenceLink || ""
    });

    // 🔥 SLA calculate after creation
    task.slaStatus = "SAFE";

    task.deadlineAt = new Date(
      Date.now() + task.estimatedMinutes * 60 * 1000
    );

    await task.save();
    // ✅ Workload tracking
    await User.findByIdAndUpdate(task.assignedTo, {
      $inc: {
        currentActiveTasks: 1,
        totalTasks: 1   // 🔥 ADD THIS
      }
    });

    // ✅ Activity Log
    await logActivity({
      organizationId: task.organizationId,
      userId: currentUser._id,
      actionType: "TASK_CREATED",
      targetType: "TASK",
      targetId: task._id,
      clientId: task.clientId,
      workshopId: task.workshopId,
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

    // 🔥 ✅ ADD THIS BLOCK HERE (IMPORTANT)
    if (task.status !== "ASSIGNED") {
      throw new Error("Task already started or not allowed");
    }

    // existing validation (keep it)
    if (!canTransition(task.status, "IN_PROGRESS"))
      throw new Error("Invalid state transition");

    // 🔥 STATUS CHANGE (no change here)
    task.status = "IN_PROGRESS";
    task.startedAt = new Date();

    task.slaStatus = calculateSLAStatus(
      task.startedAt,
      task.estimatedMinutes,
      task.delayMinutes
    );

    await task.save();

    // ✅ TimeLog start
    await TimeLog.create({
      organizationId: task.organizationId,
      taskId: task._id,
      userId: currentUser._id,
      startTime: new Date()
    });

    await logActivity({
      organizationId: task.organizationId,
      userId: currentUser._id,
      actionType: "TASK_STARTED",
      targetType: "TASK",
      targetId: task._id,
      clientId: task.clientId,
      workshopId: task.workshopId,
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

    if (!task.startedAt) {
      task.startedAt = task.assignedAt || new Date();
    }

    const now = new Date();

    const { actualMinutes, delayMinutes } =
      calculateTaskTime(task.startedAt, now, task.estimatedMinutes);

    task.status = "IN_REVIEW";
    task.submittedAt = now;
    task.actualMinutes = actualMinutes;
    task.delayMinutes = delayMinutes;
    task.isOnTime = delayMinutes <= 0;

    task.submissionData = submissionData;
    task.submissionType = submissionData?.startsWith("http")
      ? "LINK"
      : "TEXT";

    if (task.delayMinutes > 0) {
      task.slaStatus = "OVERDUE";
    } else if (task.delayMinutes > -5) {
      task.slaStatus = "AT_RISK";
    } else {
      task.slaStatus = "SAFE";
    }
    await task.save();

    // ✅ TimeLog end
    const timeLog = await TimeLog.findOne({
      taskId: task._id,
      userId: currentUser._id,
      endTime: null
    });

    if (timeLog) {
      timeLog.endTime = new Date();
      timeLog.duration =
        (timeLog.endTime.getTime() - timeLog.startTime.getTime()) / 60000;
      await timeLog.save();
    }

    // Escalation
    if (task.slaStatus === "AT_RISK") {
      const alreadyEscalated =
        await escalationService.hasOpenEscalation(task._id);

      if (!alreadyEscalated) {
        await escalationService.createEscalation(
          task,
          "Task is at risk",
          "SLA_RISK"
        );
      }
    }

    await logActivity({
      organizationId: task.organizationId,
      userId: currentUser._id,
      actionType: "TASK_SUBMITTED",
      targetType: "TASK",
      targetId: task._id,
      clientId: task.clientId,
      workshopId: task.workshopId,
      metadata: {
        duration: actualMinutes,
        delay: delayMinutes,
        status: task.slaStatus,
      },
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

// 🔥 FIRST calculate delay
if (task.deadlineAt && new Date() > task.deadlineAt) {
  task.delayMinutes = Math.round(
    (new Date().getTime() - task.deadlineAt.getTime()) / 60000
  );
}

// 🔥 THEN SLA
if (task.delayMinutes > 0) {
  task.slaStatus = "OVERDUE";
} else if (task.delayMinutes > -5) {
  task.slaStatus = "AT_RISK";
} else {
  task.slaStatus = "SAFE";
}
    await task.save();

    // ✅ Workload reduce
    await User.findByIdAndUpdate(task.assignedTo, {
      $inc: { currentActiveTasks: -1 },
      lastTaskCompletedAt: new Date()
    });

    await logActivity({
      organizationId: task.organizationId,
      userId: currentUser._id,
      actionType: "TASK_APPROVED",
      targetType: "TASK",
      targetId: task._id,
      clientId: task.clientId,
      workshopId: task.workshopId,
    });

    if (task.delayMinutes > 0) {
      const alreadyEscalated =
        await escalationService.hasOpenEscalation(task._id);

      if (!alreadyEscalated) {
        await escalationService.createEscalation(
          task,
          "Task delayed",
          "DELAY"
        );
      }
    }

    await this.updateUserPerformance(
      task.assignedTo.toString(),
      task
    );

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

    // optional user revision tracking
    // await User.findByIdAndUpdate(task.assignedTo, {
    //   $inc: { totalRevisions: 1 }
    // });

    await logActivity({
      organizationId: task.organizationId,
      userId: currentUser._id,
      actionType: "REVISION_REQUESTED",
      targetType: "TASK",
      targetId: task._id,
      clientId: task.clientId,
      workshopId: task.workshopId,
    });

    return task;
  }

  async getTasks(currentUser: IUser, workshopId?: string) {

    const query: any = {
      organizationId: currentUser.organizationId
    };

    if (workshopId) {
      query.workshopId = workshopId;
    }

    const tasks = await Task.find(query)
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    // 🔥 AUTO SLA UPDATE (IMPORTANT)
    const now = Date.now();

    for (let task of tasks) {

      if (task.deadlineAt && task.status !== "APPROVED") {

        const diff = task.deadlineAt.getTime() - now;

        let newStatus: any = "SAFE";

        if (diff < 0) newStatus = "OVERDUE";
        else if (diff < 5 * 60 * 1000) newStatus = "AT_RISK";

        // 🔥 only update if changed
        if (task.slaStatus !== newStatus) {
          task.slaStatus = newStatus;
          await task.save(); // 🔥 IMPORTANT
        }
      }
    }

    return tasks;
  }
  async getTask(taskId: string, currentUser: IUser) {

    const task = await Task.findOne({
      _id: taskId,
      organizationId: currentUser.organizationId
    })
      .populate("assignedTo", "name email")
      .populate("assignedBy", "name");

    if (!task) throw new Error("Task not found");

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

    // 🔥 revision tracking
    user.totalRevisions += task.revisionCount;

    // 🔥 avg time
    const totalTime =
      user.averageCompletionMinutes *
      (user.completedTasks - 1) +
      task.actualMinutes;

    user.averageCompletionMinutes =
      Math.round(totalTime / user.completedTasks);

    // 🔥 BASE SCORE
    let score = calculatePerformanceScore({
      completedTasks: user.completedTasks,
      onTimeTasks: user.onTimeTasks,
      lateTasks: user.lateTasks,
      totalRevisions: user.totalRevisions,
    });

    // 🔥 BONUS / PENALTY SYSTEM
    if (task.delayMinutes > 10) {
      score -= 3; // heavy delay
    }

    if (task.delayMinutes < -5) {
      score += 2; // fast work bonus
    }

    if (task.revisionCount > 0) {
      score -= 1; // revision penalty
    }
const finalScore = Math.max(0, score);

user.performanceScore = finalScore;
user.ratingTag = getRatingTag(finalScore);

    await user.save();
  }
  async updateTaskStatus(taskId: string, status: TaskStatus, user: IUser) {

    const task = await Task.findOne({
      _id: taskId,
      organizationId: user.organizationId
    });

    if (!task) throw new Error("Task not found");

    // 🔥 ❌ BLOCK WRONG USAGE (IMPORTANT)
    if (status === "APPROVED") {
      throw new Error("Use approveTask API instead");
    }

    // 🔥 STRICT FLOW CONTROL
    const allowedTransitions: any = {
      ASSIGNED: ["IN_PROGRESS"],
      IN_PROGRESS: ["IN_REVIEW"],
      IN_REVIEW: ["CHANGES_REQUESTED"], // ❌ removed APPROVED from here
    };

    if (!allowedTransitions[task.status]?.includes(status)) {
      throw new Error("Invalid status transition");
    }

    // 🔥 SAVE OLD VALUE (for audit log)
    const oldStatus = task.status;

    // 🔥 UPDATE
    task.status = status;

    await task.save();

    // 🔥 LOG WITH OLD + NEW VALUE
    await logActivity({
      organizationId: task.organizationId,
      userId: user._id,
      actionType: "TASK_STATUS_CHANGED",
      targetType: "TASK",
      targetId: task._id,
      clientId: task.clientId,
      workshopId: task.workshopId,
      oldValue: oldStatus,   // 🔥 ADD THIS
      newValue: status,
      metadata: { newStatus: status },
    });

    return task;
  }


}

export default new TaskService();