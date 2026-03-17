import Activity from "./activity.model";
import { io } from "../../socket";

export const logActivity = async (
  organizationId: string,
  workshopId: string,
  userId: string,
  action: string,
  message: string,
  taskId?: string
) => {

  const activity = await Activity.create({
    organizationId,
    workshopId,
    userId,
    action,
    message,
    taskId
  });

  // 🔥 Emit realtime event
  io.to(workshopId.toString()).emit("NEW_ACTIVITY", activity);

  return activity;
};