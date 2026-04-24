import eventBus from "../../utils/eventBus";
import { createNotification } from "./notification.service";
import User from "../users/user.model";
import { sendPush } from "./push.service";

/* =========================
   🔔 TASK ASSIGNED
========================= */
eventBus.on("TASK_ASSIGNED", async (data: any) => {
  console.log("🔥 TASK_ASSIGNED");

  await createNotification({
    userId: data.assignedTo,
    type: "TASK_ASSIGNED",
    title: "New Task Assigned",
    message: data.title,
    data: {
      taskId: data.taskId,
      title: data.title,
    },
  });

  const user = await User.findById(data.assignedTo);
  if (!user?.fcmTokens?.length) return;

 await Promise.allSettled(
  (user.fcmTokens || []).map((token: string) =>
    sendPush(token, "New Task Assigned", data.title, {
      url: "/dashboard/notifications",
    })
  )
);
});

/* =========================
   🔔 TASK SUBMITTED (TL को)
========================= */
eventBus.on("TASK_SUBMITTED", async (data: any) => {
  console.log("🔥 TASK_SUBMITTED");

  await createNotification({
    userId: data.assignedBy,
    type: "TASK_SUBMITTED",
    title: "Task Submitted",
    message: data.title,
    data: {
      taskId: data.taskId,
      title: data.title,
    },
  });

  const user = await User.findById(data.assignedBy);
  if (!user?.fcmTokens?.length) return;

  await Promise.allSettled(
  (user.fcmTokens || []).map((token: string) =>
    sendPush(token, "Task Submitted", data.title, {
      url: `/tasks/${data.taskId}`,
    })
  )
);
});

/* =========================
   🔔 TASK APPROVED
========================= */
eventBus.on("TASK_APPROVED", async (data: any) => {
  console.log("🔥 TASK_APPROVED");

  await createNotification({
    userId: data.assignedTo,
    type: "TASK_APPROVED",
    title: "Task Approved",
    message: data.title,
    data: {
      taskId: data.taskId,
      title: data.title,
    },
  });

  const user = await User.findById(data.assignedTo);
  if (!user?.fcmTokens?.length) return;

  await Promise.allSettled(
  (user.fcmTokens || []).map((token: string) =>
    sendPush(token, "Task Approved", data.title, {
      url: `/tasks/${data.taskId}`,
    })
  )
);
});

/* =========================
   🔥 TASK READY FOR APPROVAL (MOST IMPORTANT)
========================= */
eventBus.on("TASK_READY_FOR_APPROVAL", async (data: any) => {
  console.log("🔥 TASK_READY_FOR_APPROVAL");

  for (const user of data.users) {

    // ✅ SAFE SELF SKIP
    if (
      data.triggeredBy &&
      user._id.toString() === data.triggeredBy.toString()
    ) continue;

    await createNotification({
      userId: user._id,
      type: "TASK_READY_FOR_APPROVAL",
      title: "Task Ready for Approval",
      message: data.title,
      data: {
        taskId: data.taskId,
        title: data.title,
      },
    });

    // ✅ SAFE TOKEN CHECK
    if (!user?.fcmTokens?.length) continue;

    await Promise.allSettled(
      user.fcmTokens.map((token: string) =>
        sendPush(
          token,
          "Task Ready for Approval",
          data.title,
          {
            url: `/tasks/${data.taskId}`,
          }
        )
      )
    );
  }
});