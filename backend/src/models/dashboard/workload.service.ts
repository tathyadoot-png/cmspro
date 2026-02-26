import Task from "../tasks/task.model";
import User from "../users/user.model";
import { IUser } from "../users/user.model";

class WorkloadService {

  async getWorkloadDistribution(currentUser: IUser) {

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

      const taskAggregation = await Task.aggregate([
        {
          $match: {
            organizationId: orgId,
            assignedTo: user._id,
            status: { $in: ["ASSIGNED", "IN_PROGRESS", "IN_REVIEW"] },
          },
        },
        {
          $group: {
            _id: null,
            totalEstimated: { $sum: "$estimatedMinutes" },
          },
        },
      ]);

      const totalEstimatedMinutes =
        taskAggregation[0]?.totalEstimated || 0;

      let status = "OPTIMAL";

      if (activeTasks >= 8)
        status = "OVERLOADED";
      else if (activeTasks <= 2)
        status = "UNDERUTILIZED";

      results.push({
        userId: user._id,
        name: user.name,
        activeTasks,
        totalEstimatedMinutes,
        workloadStatus: status,
      });
    }

    return results;
  }
}

export default new WorkloadService();