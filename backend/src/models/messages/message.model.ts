import mongoose, { Schema, Document, Types } from "mongoose";

export interface IMessage extends Document {

  organizationId: Types.ObjectId;

  workshopId: Types.ObjectId;

  sender: Types.ObjectId;

  message?: string;

  type: "TEXT" | "TASK_EVENT";

  metadata?: {
    taskId?: Types.ObjectId;
    assignedTo?: Types.ObjectId;
    assignedBy?: Types.ObjectId;
  };

}

const MessageSchema = new Schema<IMessage>(
  {

    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },

    workshopId: {
      type: Schema.Types.ObjectId,
      ref: "Workshop",
      required: true,
      index: true,
    },

    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    message: {
      type: String,
    },

    type: {
      type: String,
      enum: ["TEXT", "TASK_EVENT"],
      default: "TEXT",
    },

    metadata: {
      taskId: { type: Schema.Types.ObjectId },
    assignedTo: {
  type: Schema.Types.ObjectId,
  ref: "User"
},
assignedBy: {
  type: Schema.Types.ObjectId,
  ref: "User"
}
    },

  },
  { timestamps: true }
);

export default mongoose.model<IMessage>("Message", MessageSchema);