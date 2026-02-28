import Escalation from "./escalation.model";
import User from "../users/user.model";
import { IUser } from "../users/user.model";
import { emitEscalation } from "../../socket";
class EscalationService {

  async createEscalation(task: any, reason: string) {

    const tl = await User.findOne({
      organizationId: task.organizationId,
      roles: { $exists: true },
    }).populate("roles");

    if (!tl) return;

    await Escalation.create({
      organizationId: task.organizationId,
      taskId: task._id,
      escalatedTo: tl._id,
      reason,
    });
    emitEscalation({
  taskId: task._id,
  reason,
});
  }

  async getOpenEscalations(currentUser: IUser) {

    return Escalation.find({
      organizationId: currentUser.organizationId,
      status: "OPEN",
    })
      .populate("taskId")
      .populate("escalatedTo");
  }

  async hasOpenEscalation(taskId: any) {
  const existing = await Escalation.findOne({
    taskId,
    status: "OPEN",
  });
  return !!existing;
}
}

export default new EscalationService();