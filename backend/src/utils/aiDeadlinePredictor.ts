import User from "../models/users/user.model";

export const predictDeadlineRisk = async (
  userId: string,
  estimatedMinutes: number
) => {

  const user = await User.findById(userId);

  if (!user) return "SAFE";

  const historicalAvg = user.averageCompletionMinutes || estimatedMinutes;

  const riskRatio = historicalAvg / estimatedMinutes;

  // 🔥 Smart threshold logic
  if (riskRatio > 1.3) return "HIGH_RISK";
  if (riskRatio > 1.1) return "AT_RISK";

  return "SAFE";
};