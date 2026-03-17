import TaskComment from "./taskComment.model";

export const createComment = async (
  organizationId: string,
  taskId: string,
  userId: string,
  message: string
) => {

  const comment = await TaskComment.create({
    organizationId,
    taskId,
    userId,
    message
  });

  return comment;
};

export const getTaskComments = async (taskId: string) => {

  return TaskComment.find({ taskId })
    .populate("userId", "name email")
    .sort({ createdAt: -1 });

};