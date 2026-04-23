import mongoose, { Schema } from "mongoose";

const NotificationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    index: true,
  },

  type: String,
  title: String,
  message: String,

  data: Schema.Types.Mixed,

  isRead: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

export default mongoose.model("Notification", NotificationSchema);