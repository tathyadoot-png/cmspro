import User from "../users/user.model";
import Task from "../tasks/task.model";
import { IUser } from "../users/user.model";

class BurnoutService {

  async detectBurnout(currentUser: IUser) {

    const orgId = currentUser.organizationId;

    const users = await User.find({
      organizationId: orgId,
      isActive: true,
    });

    const results = [];

    for (const user of users) {

      const activeTasks = await Task.countDocuments({
        organizationId: orgId,
        assignedTo: user._id,
        status: { $in: ["ASSIGNED", "IN_PROGRESS", "IN_REVIEW"] },
      });

      const completedTasks = user.completedTasks || 0;
      const lateTasks = user.lateTasks || 0;
      const revisionCount = user.totalRevisions || 0;

      const delayRate =
        completedTasks === 0
          ? 0
          : (lateTasks / completedTasks) * 100;

      let burnoutScore = 0;

      // Workload factor
      if (activeTasks >= 8) burnoutScore += 30;

      // Delay factor
      if (delayRate >= 40) burnoutScore += 25;

      // Revision factor
      if (revisionCount >= 10) burnoutScore += 20;

      // Performance factor
      if (user.performanceScore < 50) burnoutScore += 25;

      let status = "SAFE";

      if (burnoutScore >= 60)
        status = "BURNOUT_RISK";
      else if (burnoutScore >= 30)
        status = "WATCH";

      results.push({
        userId: user._id,
        name: user.name,
        activeTasks,
        delayRate: Math.round(delayRate),
        performanceScore: user.performanceScore,
        burnoutScore,
        burnoutStatus: status,
      });
    }

    return results;
  }
}

export default new BurnoutService();