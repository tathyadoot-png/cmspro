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
  snapshot,
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
  workshopId,
  oldValue,
  newValue,
  metadata,
  snapshot, // ✅ ADD THIS
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


export const getTaskActivity = async (
  taskId: string,
  user: any
) => {
  return ActivityLog.find({
    organizationId: user.organizationId,
    targetId: taskId,
    targetType: "TASK",
  })
    .populate("userId", "name email")
    .sort({ createdAt: -1 });
};