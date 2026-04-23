import Notification from "./notification.model";

export const createNotification = async ({
  userId,
  type,
  title,
  message,
  data,
}: any) => {
  return Notification.create({
    userId,
    type,
    title,
    message,
    data,
  });
};