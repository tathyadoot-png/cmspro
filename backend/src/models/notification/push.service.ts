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
      notification: {
        title,
        body,
      },
      webpush: {
        fcmOptions: {
          link: data.url || "/",
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

      // 🔥 DB से token हटा दो
      await User.updateMany(
        { fcmTokens: token },
        { $pull: { fcmTokens: token } }
      );
    } else {
      console.error("🔥 Push Error:", error);
    }
  }
};