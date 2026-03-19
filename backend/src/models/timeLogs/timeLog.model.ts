import mongoose, { Schema, Document, Types } from "mongoose";

export interface ITimeLog extends Document {
  organizationId: Types.ObjectId;
  taskId: Types.ObjectId;
  userId: Types.ObjectId;

  startTime: Date;
  endTime?: Date;

  duration: number;
}

const TimeLogSchema = new Schema<ITimeLog>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },

    taskId: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      required: true,
      index: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    startTime: {
      type: Date,
      required: true,
    },

    endTime: Date,

    duration: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ITimeLog>("TimeLog", TimeLogSchema);