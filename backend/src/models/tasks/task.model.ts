// src/modules/tasks/task.model.ts

import mongoose, { Schema, Document, Types } from "mongoose";

export type TaskStatus =
  | "CREATED"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "IN_REVIEW"
  | "CHANGES_REQUESTED"
  | "APPROVED"
  | "COMPLETED";

export type SubmissionType = "IMAGE" | "LINK" | "FILE" | "TEXT";

export interface ITask extends Document {
  organizationId: Types.ObjectId;
  clientId: Types.ObjectId;
  projectId: Types.ObjectId;

  title: string;
  description: string;

  assignedBy: Types.ObjectId;
  assignedTo: Types.ObjectId;

  status: TaskStatus;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";

  estimatedMinutes: number;

  startedAt?: Date;
  submittedAt?: Date;
  completedAt?: Date;

  actualMinutes: number;
  delayMinutes: number;

  revisionCount: number;

  submissionType?: SubmissionType;
  submissionData?: string;

  ratingByTL?: number;

  // 🔥 ADD THESE
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },

    clientId: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: true,
      index: true,
    },

    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },

    title: { type: String, required: true },
    description: String,

    assignedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: [
        "CREATED",
        "ASSIGNED",
        "IN_PROGRESS",
        "IN_REVIEW",
        "CHANGES_REQUESTED",
        "APPROVED",
        "COMPLETED",
      ],
      default: "CREATED",
      index: true,
    },

    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
      default: "MEDIUM",
    },

    estimatedMinutes: { type: Number, required: true },

    startedAt: Date,
    submittedAt: Date,
    completedAt: Date,

    actualMinutes: { type: Number, default: 0 },
    delayMinutes: { type: Number, default: 0 },

    revisionCount: { type: Number, default: 0 },

    submissionType: {
      type: String,
      enum: ["IMAGE", "LINK", "FILE", "TEXT"],
    },

    submissionData: String,

    ratingByTL: {
      type: Number,
      min: 1,
      max: 5,
    },
  },
  { timestamps: true }
);

/* Compound Index for Dashboard Speed */
TaskSchema.index({ organizationId: 1, status: 1 });
TaskSchema.index({ assignedTo: 1, status: 1 });
TaskSchema.index({ clientId: 1, status: 1 });

export default mongoose.model<ITask>("Task", TaskSchema);