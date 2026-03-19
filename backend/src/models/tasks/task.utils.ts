export const canTransition = (current: string, next: string) => {

  const flow: any = {
    ASSIGNED: ["IN_PROGRESS"],
    IN_PROGRESS: ["IN_REVIEW"],
    IN_REVIEW: ["APPROVED", "CHANGES_REQUESTED"],
    CHANGES_REQUESTED: ["IN_PROGRESS"],
    APPROVED: []
  };

  return flow[current]?.includes(next);
};