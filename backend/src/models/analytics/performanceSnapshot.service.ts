import PerformanceSnapshot from "./performanceSnapshot.model";
import User from "../users/user.model";

export const createMonthlySnapshot = async () => {

  const now = new Date();

  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const users = await User.find();

  for (const user of users) {

    await PerformanceSnapshot.create({
      organizationId: user.organizationId,
      userId: user._id,

      month,
      year,

      totalTasks: user.completedTasks + user.lateTasks,
      completedTasks: user.completedTasks,
      onTimeTasks: user.onTimeTasks,
      lateTasks: user.lateTasks,

      totalRevisions: user.totalRevisions,

      averageCompletionMinutes: user.averageCompletionMinutes,

      performanceScore: user.performanceScore,

      ratingTag: user.ratingTag,

      burnoutRisk:
        user.performanceScore < 40
          ? "HIGH"
          : user.performanceScore < 70
          ? "MEDIUM"
          : "LOW"

    });

  }

};