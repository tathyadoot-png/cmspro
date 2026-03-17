import Task from "../tasks/task.model";
import Activity from "../activity/activity.model";

export const getUserStats = async (
  userId: string,
  organizationId: string
) => {

  const tasksCompleted = await Task.countDocuments({
    assignedTo: userId,
    organizationId,
    status: "APPROVED"
  });

  const tasksInProgress = await Task.countDocuments({
    assignedTo: userId,
    organizationId,
    status: "IN_PROGRESS"
  });

  const tasksPending = await Task.countDocuments({
    assignedTo: userId,
    organizationId,
    status: { $in: ["ASSIGNED","IN_REVIEW"] }
  });

  const activities = await Activity.find({
    userId,
    organizationId
  })
  .sort({createdAt:-1})
  .limit(20);

  return {
    tasksCompleted,
    tasksInProgress,
    tasksPending,
    activities
  };

};