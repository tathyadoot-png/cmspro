// src/modules/audit/activityLog.model.ts

import mongoose, { Schema, Document, Types } from "mongoose";

export type ActionType =
  | "TASK_CREATED"
  | "TASK_ASSIGNED"
  | "TASK_STARTED"
  | "TASK_SUBMITTED"
  | "TASK_APPROVED"
  | "TASK_COMPLETED"
  | "REVISION_REQUESTED"
  | "STATUS_UPDATED"
  | "USER_CREATED"
  | "ROLE_UPDATED"
  | "CLIENT_CREATED"
  | "PROJECT_CREATED";

export interface IActivityLog extends Document {
  organizationId: Types.ObjectId;

  userId: Types.ObjectId; // who performed action
  actionType: ActionType;
 workshopId: Types.ObjectId;
  targetType: "TASK" | "USER" | "CLIENT" | "PROJECT";
  targetId: Types.ObjectId;
clientId?: Types.ObjectId; 
metadata?: any; 
  oldValue?: any;
  newValue?: any;

  ipAddress?: string;
  userAgent?: string;
}

const ActivityLogSchema = new Schema<IActivityLog>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    actionType: {
      type: String,
      required: true,
      index: true,
    },

    targetType: {
      type: String,
      enum: ["TASK", "USER", "CLIENT", "PROJECT"],
      required: true,
    },

    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
workshopId: {
  type: Schema.Types.ObjectId,
  ref: "Workshop",
  index: true,
},
    clientId: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      index: true,
    },

    metadata: {
      duration: Number,
      delay: Number,
      status: String,
    },
    oldValue: Schema.Types.Mixed,
    newValue: Schema.Types.Mixed,

    ipAddress: String,
    userAgent: String,
  },

  { timestamps: true }
);

/* Performance Indexes */
ActivityLogSchema.index({ organizationId: 1, createdAt: -1 });
ActivityLogSchema.index({ targetId: 1, createdAt: -1 });

export default mongoose.model<IActivityLog>(
  "ActivityLog",
  ActivityLogSchema
);