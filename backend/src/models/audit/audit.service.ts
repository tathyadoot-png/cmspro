import ActivityLog from "./activityLog.model";

export const logActivity = async ({
  organizationId,
  userId,
  actionType,
  targetType,
  targetId,
  clientId,
  workshopId, // ✅ ADD THIS
  oldValue,
  newValue,
  metadata,
  ipAddress,
  userAgent,
}: any) => {
  console.log("🧠 LOGGING ACTIVITY:", { metadata }); // ✅ DEBUG

  await ActivityLog.create({
    organizationId,
    userId,
    actionType,
    targetType,
    targetId,
    clientId,
    workshopId, // ✅ SAVE THIS
    oldValue,
    newValue,
    metadata,
    ipAddress,
    userAgent,
  });

};

export const getWorkshopActivity = async (
  workshopId: string,
  user: any
) => {

  return ActivityLog.find({
    organizationId: user.organizationId,
    workshopId: workshopId, // 🔥 IMPORTANT
  })
  .populate("userId", "name email userCode")
  .populate("targetId", "title status")
  .sort({ createdAt: -1 })
  .limit(50);

};