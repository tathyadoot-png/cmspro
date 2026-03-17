import { getIO } from "../../socket";

export const logActivity = async (
  organizationId: string,
  workshopId: string,
  userId: string,
  action: string,
  message: string,
  taskId?: string
) => {

  try {

    // 🔥 यहाँ तुम्हारा DB save logic होगा (अगर है तो रहने दो)

    // 🔥 SOCKET SAFE EMIT
    try {

      const io = getIO();

      io.to(workshopId.toString()).emit("ACTIVITY_LOG", {
        organizationId,
        workshopId,
        userId,
        action,
        message,
        taskId,
        createdAt: new Date()
      });

    } catch (err) {

      console.log("⚠️ Socket not initialized, skipping emit");

    }

  } catch (error) {

    console.error("Activity log error:", error);

  }
};