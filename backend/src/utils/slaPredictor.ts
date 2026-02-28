export const calculateSLAStatus = (
  startedAt: Date | undefined,
  estimatedMinutes: number,
  delayMinutes: number
) => {

  if (delayMinutes > 0)
    return "OVERDUE";

  if (!startedAt)
    return "SAFE";

  const now = new Date();

  const elapsed =
    (now.getTime() - startedAt.getTime()) / 60000;

  const remaining =
    estimatedMinutes - elapsed;

  if (remaining <= estimatedMinutes * 0.2)
    return "AT_RISK";

  return "SAFE";
};