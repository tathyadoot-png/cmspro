import Task from "../tasks/task.model";
import { IUser } from "../users/user.model";

class SLAService {

  async getSLAOverview(currentUser: IUser) {

    const orgId = currentUser.organizationId;

    const safe = await Task.countDocuments({
      organizationId: orgId,
      slaStatus: "SAFE",
    });

    const atRisk = await Task.countDocuments({
      organizationId: orgId,
      slaStatus: "AT_RISK",
    });

    const overdue = await Task.countDocuments({
      organizationId: orgId,
      slaStatus: "OVERDUE",
    });

    return {
      safe,
      atRisk,
      overdue,
    };
  }
}

export default new SLAService();