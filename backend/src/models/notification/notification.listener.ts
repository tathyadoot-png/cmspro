import eventBus from "../../utils/eventBus";
import { createNotification } from "./notification.service";
import User from "../users/user.model";
import { sendPush } from "./push.service";

// 🔔 TASK ASSIGNED
eventBus.on("TASK_ASSIGNED", async (data: any) => {
  console.log("🔥 EVENT WORKING - TASK_ASSIGNED");

  // 1. DB notification save
await createNotification({
  userId: data.assignedTo,
  type: "TASK_ASSIGNED",
  title: "New Task Assigned",
  message: data.title,
  data: {
    taskId: data.taskId,   // ✅ THIS LINE IMPORTANT
    title: data.title
  },
});
  // 2. PUSH notification
  const user = await User.findById(data.assignedTo);

  if (!user?.fcmTokens?.length) return;

for (const token of user.fcmTokens) {
  await sendPush(
    token,
    "New Task Assigned",
    data.title,
    {
      url: "/dashboard/notifications", // 🔥 IMPORTANT
    }
  );
}

// 🔔 TASK SUBMITTED
eventBus.on("TASK_SUBMITTED", async (data: any) => {
  console.log("🔥 EVENT WORKING - TASK_SUBMITTED");

  await createNotification({
    userId: data.assignedBy,
    type: "TASK_SUBMITTED",
    title: "Task Submitted",
    message: data.title,
    data: {
  taskId: data.taskId,
  title: data.title
}
  });

  const user = await User.findById(data.assignedBy);

  if (!user?.fcmTokens?.length) return;

  for (const token of user.fcmTokens) {
    await sendPush(token, "Task Submitted", data.title);
  }
});

// 🔔 TASK APPROVED
eventBus.on("TASK_APPROVED", async (data: any) => {
  console.log("🔥 EVENT WORKING - TASK_APPROVED");

  await createNotification({
    userId: data.assignedTo,
    type: "TASK_APPROVED",
    title: "Task Approved",
    message: data.title,
    data,
  });

  const user = await User.findById(data.assignedTo);

  if (!user?.fcmTokens?.length) return;

  for (const token of user.fcmTokens) {
    await sendPush(token, "Task Approved", data.title);
  }
}) 
})