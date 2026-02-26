// src/utils/taskStateMachine.ts

import { TaskStatus } from "../models/tasks/task.model";

export const allowedTransitions: Record<TaskStatus, TaskStatus[]> = {
  CREATED: ["ASSIGNED"],
  ASSIGNED: ["IN_PROGRESS"],
  IN_PROGRESS: ["IN_REVIEW"],
  IN_REVIEW: ["CHANGES_REQUESTED", "APPROVED"],
  CHANGES_REQUESTED: ["IN_PROGRESS"],
  APPROVED: ["COMPLETED"],
  COMPLETED: [],
};

export const canTransition = (
  current: TaskStatus,
  next: TaskStatus
) => {
  return allowedTransitions[current].includes(next);
};