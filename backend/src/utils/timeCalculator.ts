// src/utils/timeCalculator.ts

export const calculateTaskTime = (
  startedAt: Date,
  submittedAt: Date,
  estimatedMinutes: number
) => {
  const actualMinutes =
    (submittedAt.getTime() - startedAt.getTime()) / 60000;

  const delayMinutes = actualMinutes - estimatedMinutes;

  return {
    actualMinutes: Math.round(actualMinutes),
    delayMinutes: Math.round(delayMinutes),
  };
};