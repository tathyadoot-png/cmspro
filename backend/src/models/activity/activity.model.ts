import mongoose, { Schema, Document, Types } from "mongoose";

export interface IActivity extends Document {
  organizationId: Types.ObjectId;
  userId: Types.ObjectId;
  action: string;
  taskId?: Types.ObjectId;
  message: string;
    workshopId: Types.ObjectId;

}

const ActivitySchema = new Schema<IActivity>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    workshopId: {
      type: Schema.Types.ObjectId,
      ref: "Workshop"
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    action: {
      type: String,
      required: true,
    },

    taskId: {
      type: Schema.Types.ObjectId,
      ref: "Task",
    },

    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IActivity>("Activity", ActivitySchema);