import admin from "../../utils/firebaseAdmin";

// ✅ type define करो
interface PushData {
  url?: string;
}

export const sendPush = async (
  token: string,
  title: string,
  body: string,
  data: PushData = {}
) => {
  await admin.messaging().send({
    token,
    notification: {
      title,
      body,
    },
    webpush: {
      fcmOptions: {
        link: data.url || "/", // ✅ अब error नहीं आएगा
      },
    },
  });
};