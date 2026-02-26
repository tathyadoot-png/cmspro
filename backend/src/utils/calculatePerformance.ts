// backend/src/utils/calculatePerformance.ts

export const calculatePerformanceScore = ({
  completedTasks,
  onTimeTasks,
  lateTasks,
  totalRevisions,
}: any) => {
  if (completedTasks === 0) return 0;

  const onTimeRate = onTimeTasks / completedTasks;
  const lateRate = lateTasks / completedTasks;
  const revisionImpact = totalRevisions * 0.02;

  const score =
    onTimeRate * 60 -
    lateRate * 20 -
    revisionImpact * 20;

  return Math.max(0, Math.min(100, Math.round(score)));
};

export const getRatingTag = (score: number) => {
  if (score >= 80) return "VERY_GOOD";
  if (score >= 60) return "GOOD";
  if (score >= 40) return "OK";
  return "BAD";
};