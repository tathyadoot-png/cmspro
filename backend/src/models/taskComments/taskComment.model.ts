import mongoose, { Schema, Document, Types } from "mongoose";

export interface ITaskComment extends Document {
  organizationId: Types.ObjectId;
  taskId: Types.ObjectId;
  userId: Types.ObjectId;
  message: string;
}

const TaskCommentSchema = new Schema<ITaskComment>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true
    },
    taskId: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    message: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model<ITaskComment>(
  "TaskComment",
  TaskCommentSchema
);