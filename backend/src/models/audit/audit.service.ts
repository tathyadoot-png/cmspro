import ActivityLog from "./activityLog.model";
import Activity from "../activity/activity.model";

export const logActivity = async ({
  organizationId,
  userId,
  actionType,
  targetType,
  targetId,
  oldValue,
  newValue,
  ipAddress,
  userAgent,
}: any) => {

  await ActivityLog.create({
    organizationId,
    userId,
    actionType,
    targetType,
    targetId,
    oldValue,
    newValue,
    ipAddress,
    userAgent,
  });

};


export const getWorkshopActivity = async (
  workshopId: string,
  user: any
) => {

  return Activity.find({
    organizationId: user.organizationId,
    workshopId: workshopId
  })
  .populate("userId", "name email")
  .sort({ createdAt: -1 })
  .limit(20);

};