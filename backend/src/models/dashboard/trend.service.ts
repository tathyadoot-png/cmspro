import Task from "../tasks/task.model";
import { IUser } from "../users/user.model";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";

dayjs.extend(isoWeek);

class TrendService {

  async getWeeklyTrend(currentUser: IUser) {

    const orgId = currentUser.organizationId;

    const tasks = await Task.find({
      organizationId: orgId,
    });

    const grouped: any = {};

    for (const task of tasks) {

      const weekKey = dayjs(task.createdAt)
        .isoWeek()
        .toString();

      if (!grouped[weekKey]) {
        grouped[weekKey] = {
          week: `W${weekKey}`,
          created: 0,
          completed: 0,
          totalDelay: 0,
          delayCount: 0,
        };
      }

      grouped[weekKey].created += 1;

      if (task.status === "APPROVED") {
        grouped[weekKey].completed += 1;
      }

      if (task.delayMinutes > 0) {
        grouped[weekKey].totalDelay += task.delayMinutes;
        grouped[weekKey].delayCount += 1;
      }
    }

    const result = Object.values(grouped).map((w: any) => {

      const completionRate =
        w.created === 0
          ? 0
          : Math.round((w.completed / w.created) * 100);

      const avgDelay =
        w.delayCount === 0
          ? 0
          : Math.round(w.totalDelay / w.delayCount);

      return {
        week: w.week,
        created: w.created,
        completed: w.completed,
        completionRate,
        avgDelay,
      };
    });

    return result.sort((a: any, b: any) =>
      a.week.localeCompare(b.week)
    );
  }

  async getMonthlyTrend(currentUser: IUser) {

    const orgId = currentUser.organizationId;

    const tasks = await Task.find({
      organizationId: orgId,
    });

    const grouped: any = {};

    for (const task of tasks) {

      const monthKey = dayjs(task.createdAt)
        .format("YYYY-MM");

      if (!grouped[monthKey]) {
        grouped[monthKey] = {
          month: monthKey,
          created: 0,
          completed: 0,
        };
      }

      grouped[monthKey].created += 1;

      if (task.status === "APPROVED") {
        grouped[monthKey].completed += 1;
      }
    }

    return Object.values(grouped);
  }
}

export default new TrendService();