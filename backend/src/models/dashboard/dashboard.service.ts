import Task from "../tasks/task.model";
import User from "../users/user.model";
import { IUser } from "../users/user.model";

class DashboardService {

  async getAdminStats(currentUser: IUser) {

    const orgId = currentUser.organizationId;

    const totalTasks = await Task.countDocuments({
      organizationId: orgId,
    });

    const activeTasks = await Task.countDocuments({
      organizationId: orgId,
      status: { $in: ["ASSIGNED", "IN_PROGRESS", "IN_REVIEW"] },
    });

    const completedTasks = await Task.countDocuments({
      organizationId: orgId,
      status: "APPROVED",
    });

    const overdueTasks = await Task.countDocuments({
      organizationId: orgId,
      delayMinutes: { $gt: 0 },
    });

    const users = await User.find({
      organizationId: orgId,
    }).sort({ performanceScore: -1 });

    const leaderboard = users.map(u => ({
      name: u.name,
      score: u.performanceScore,
      rating: u.ratingTag,
    }));

    const completionRate =
      totalTasks === 0
        ? 0
        : Math.round((completedTasks / totalTasks) * 100);

    let healthStatus = "HEALTHY";

    if (completionRate < 50)
      healthStatus = "RISK";
    else if (completionRate < 80)
      healthStatus = "WATCH";

    return {
      totalTasks,
      activeTasks,
      completedTasks,
      overdueTasks,
      completionRate,
      leaderboard,
      healthStatus,
    };
  }
}

export default new DashboardService();