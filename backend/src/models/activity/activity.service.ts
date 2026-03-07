import Activity from "./activity.model";
import { io } from "../../socket";

export const logActivity = async (
  organizationId: string,
  userId: string,
  action: string,
  message: string,
  taskId?: string
) => {

  const activity = await Activity.create({
    organizationId,
    userId,
    action,
    message,
    taskId
  });

  io.emit("NEW_ACTIVITY", activity);

  return activity;
};