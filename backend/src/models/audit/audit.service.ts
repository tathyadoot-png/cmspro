// src/modules/audit/audit.service.ts

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