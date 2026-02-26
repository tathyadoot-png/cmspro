// src/modules/requests/workRequest.model.ts

import mongoose, { Schema, Document, Types } from "mongoose";

export type RequestStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "IN_PROGRESS"
  | "SUBMITTED"
  | "COMPLETED";

export interface IWorkRequest extends Document {
  organizationId: Types.ObjectId;

  title: string;
  description?: string;

  requestedBy: Types.ObjectId;
  requestedTo: Types.ObjectId;

  clientId?: Types.ObjectId; // optional

  status: RequestStatus;

  estimatedMinutes: number;

  startedAt?: Date;
  submittedAt?: Date;
  completedAt?: Date;

  actualMinutes: number;
  delayMinutes: number;

  submissionType?: "IMAGE" | "LINK" | "FILE" | "TEXT";
  submissionData?: string;

  isCountedInPerformance: boolean;
}

const WorkRequestSchema = new Schema<IWorkRequest>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },

    title: { type: String, required: true },
    description: String,

    requestedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    requestedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    clientId: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      index: true,
    },

    status: {
      type: String,
      enum: [
        "PENDING",
        "ACCEPTED",
        "REJECTED",
        "IN_PROGRESS",
        "SUBMITTED",
        "COMPLETED",
      ],
      default: "PENDING",
      index: true,
    },

    estimatedMinutes: { type: Number, required: true },

    startedAt: Date,
    submittedAt: Date,
    completedAt: Date,

    actualMinutes: { type: Number, default: 0 },
    delayMinutes: { type: Number, default: 0 },

    submissionType: {
      type: String,
      enum: ["IMAGE", "LINK", "FILE", "TEXT"],
    },

    submissionData: String,

    isCountedInPerformance: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

/* Indexes */
WorkRequestSchema.index({ organizationId: 1, status: 1 });
WorkRequestSchema.index({ requestedTo: 1, status: 1 });

export default mongoose.model<IWorkRequest>(
  "WorkRequest",
  WorkRequestSchema
);