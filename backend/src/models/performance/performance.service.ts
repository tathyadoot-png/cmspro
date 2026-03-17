import Workshop from "../workshops/workshops.model";
import User from "../users/user.model";

class PerformanceService {

  async getWorkshopPerformance(workshopId: string, currentUser: any) {

    const workshop = await Workshop.findOne({
      _id: workshopId,
      organizationId: currentUser.organizationId
    }).populate("members", "name completedTasks lateTasks averageCompletionMinutes ratingTag");

    if (!workshop) {
      throw new Error("Workshop not found");
    }

    // 🔥 format data for frontend
    const result = workshop.members.map((u: any) => ({
      userId: u._id,
      name: u.name,
      completedTasks: u.completedTasks || 0,
      lateTasks: u.lateTasks || 0,
      avgMinutes: u.averageCompletionMinutes || 0,
      ratingTag: u.ratingTag || "OK"
    }));

    return result;

  }

}

export default new PerformanceService();