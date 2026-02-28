import Task from "../tasks/task.model";
import { IUser } from "../users/user.model";

class RiskDashboardService {

  async getRiskStats(currentUser: IUser) {

    const orgId = currentUser.organizationId;

    const totalTasks = await Task.countDocuments({
      organizationId: orgId,
    });

    const safe = await Task.countDocuments({
      organizationId: orgId,
      aiRiskLevel: "SAFE",
    });

    const atRisk = await Task.countDocuments({
      organizationId: orgId,
      aiRiskLevel: "AT_RISK",
    });

    const highRisk = await Task.countDocuments({
      organizationId: orgId,
      aiRiskLevel: "HIGH_RISK",
    });

    const overdue = await Task.countDocuments({
      organizationId: orgId,
      slaStatus: "OVERDUE",
    });

    // 🔥 Risk score formula
    const riskScore =
      (highRisk * 3 + atRisk * 2 + overdue * 4);

    return {
      totalTasks,
      safe,
      atRisk,
      highRisk,
      overdue,
      riskScore,
    };
  }
}

export default new RiskDashboardService();