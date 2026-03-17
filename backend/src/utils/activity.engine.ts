import Activity from "../models/activity/activity.model";

export const emitActivity = async ({
  organizationId,
  workshopId,
  userId,
  action,
  message,
  taskId
}: any) => {

  try {

    await Activity.create({
      organizationId,
      workshopId,
      userId,
      action,
      message,
      taskId
    });

  } catch (error) {

    console.error("Activity log failed:", error);

  }

};