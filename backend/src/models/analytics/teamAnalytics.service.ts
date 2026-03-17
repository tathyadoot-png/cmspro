import Task from "../tasks/task.model";
import User from "../users/user.model";

export const getTeamAnalytics = async (organizationId: string) => {

  const totalTasks = await Task.countDocuments({ organizationId });

  const completedTasks = await Task.countDocuments({
    organizationId,
    status: "APPROVED"
  });

  const inProgressTasks = await Task.countDocuments({
    organizationId,
    status: "IN_PROGRESS"
  });

  const overdueTasks = await Task.countDocuments({
    organizationId,
    slaStatus: "OVERDUE"
  });

  const topUser = await User.findOne({ organizationId })
    .sort({ performanceScore: -1 })
    .select("name performanceScore ratingTag");

  const burnoutUsers = await User.countDocuments({
    organizationId,
    performanceScore: { $lt: 40 }
  });

  return {
    totalTasks,
    completedTasks,
    inProgressTasks,
    overdueTasks,
    topUser,
    burnoutUsers
  };

};