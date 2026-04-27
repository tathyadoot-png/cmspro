import admin from "../../utils/firebaseAdmin";
import User from "../users/user.model";

export const sendPush = async (
  token: string,
  title: string,
  body: string,
  data: any = {}
) => {
  try {
    await admin.messaging().send({
      token,

      // ✅ DATA ONLY (IMPORTANT)
      data: {
        title: title || "Notification",
        body: body || "",
        url: data.url || "/",
      },

      webpush: {
        headers: {
          Urgency: "high",
        },
      },
    });

  } catch (error: any) {

    // ❌ INVALID TOKEN HANDLE
    if (
      error.code === "messaging/registration-token-not-registered" ||
      error.errorInfo?.code === "messaging/registration-token-not-registered"
    ) {
      console.log("❌ Removing invalid FCM token:", token);

      await User.updateMany(
        { fcmTokens: token },
        { $pull: { fcmTokens: token } }
      );
    } else {
      console.error("🔥 Push Error:", error);
    }
  }
};