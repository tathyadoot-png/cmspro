import ActivityLog from "./activityLog.model";

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


// 🔥 Get workshop activity
export const getWorkshopActivity = async (
  workshopId: string,
  user: any
) => {

  return ActivityLog.find({
    organizationId: user.organizationId,
    targetId: workshopId
  })
  .populate("userId", "name email")
  .sort({ createdAt: -1 })
  .limit(20);

};