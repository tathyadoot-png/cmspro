import Task from "../tasks/task.model";
import User from "../users/user.model";
import { IUser } from "../users/user.model";
import { logActivity } from "../audit/audit.service";
import { emitEscalation } from "../../socket";

class ReassignmentService {

  async autoReassign(taskId: string, currentUser: IUser) {

    const task = await Task.findOne({
      _id: taskId,
      organizationId: currentUser.organizationId,
    });

    if (!task) throw new Error("Task not found");

    const candidates = await User.find({
      organizationId: currentUser.organizationId,
      isActive: true,
      _id: { $ne: task.assignedTo },
    });

    let bestCandidate: any = null;
    let bestScore = -Infinity;

    for (const user of candidates) {

      const activeTasks = await Task.countDocuments({
        organizationId: currentUser.organizationId,
        assignedTo: user._id,
        status: { $in: ["ASSIGNED", "IN_PROGRESS", "IN_REVIEW"] },
      });

      const workloadPenalty = activeTasks * 5;
      const performanceBoost = user.performanceScore || 0;

      const finalScore = performanceBoost - workloadPenalty;

      if (finalScore > bestScore) {
        bestScore = finalScore;
        bestCandidate = user;
      }
    }

    if (!bestCandidate)
      throw new Error("No suitable candidate found");

    const oldUser = task.assignedTo;

    task.assignedTo = bestCandidate._id;

    await task.save();

    await logActivity({
      organizationId: task.organizationId,
      userId: currentUser._id,
      actionType: "TASK_REASSIGNED",
      targetType: "TASK",
      targetId: task._id,
    });

    emitEscalation({
      type: "TASK_REASSIGNED",
      taskId: task._id,
      from: oldUser,
      to: bestCandidate._id,
    });

    return task;
  }
}

export default new ReassignmentService();