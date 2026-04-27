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

export type SLAStatus = "SAFE" | "AT_RISK" | "OVERDUE";

export interface ITask extends Document {
  organizationId: Types.ObjectId;
  clientId: Types.ObjectId;
  workshopId: Types.ObjectId;
  title: string;
  description: string;
  isOnTime: boolean;
  assignedBy: Types.ObjectId;
  assignedTo: Types.ObjectId;

  status: TaskStatus;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";

  estimatedMinutes: number;

  startedAt?: Date;
  submittedAt?: Date;
  completedAt?: Date;
  assignedAt?: Date;
  actualMinutes: number;
  delayMinutes: number;

  revisionCount: number;

  taskImages: string[];

  // ✅ NEW SYSTEM (ONLY THIS)
  submissions: {
    type: SubmissionType;
    data: string;
    submittedAt: Date;
  }[];

  referenceLink?: string;
  ratingByTL?: number;

  slaStatus: SLAStatus;
  deadlineAt: Date;

  createdAt: Date;
  updatedAt: Date;
taskType?: "REEL" | "GRAPHIC" | "BANNER" | "MEDIA_COVERAGE" | "OTHERS";
  aiRiskLevel?: "SAFE" | "AT_RISK" | "HIGH_RISK";
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

    workshopId: {
      type: Schema.Types.ObjectId,
      ref: "Workshop",
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
    taskType: {
  type: String,
  enum: ["REEL", "GRAPHIC", "BANNER", "MEDIA_COVERAGE", "OTHERS"],
  required: false,
  default: null,
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

    assignedAt: {
      type: Date,
      default: Date.now,
    },

    startedAt: Date,
    submittedAt: Date,
    completedAt: Date,

    isOnTime: {
      type: Boolean,
      default: true,
    },

    actualMinutes: { type: Number, default: 0 },
    delayMinutes: { type: Number, default: 0 },

    revisionCount: { type: Number, default: 0 },

    // ✅ FINAL CLEAN STRUCTURE
    submissions: [
      {
        type: {
          type: String,
          enum: ["IMAGE", "LINK", "FILE", "TEXT"],
        },
        data: String,
        submittedAt: Date,
      },
    ],

    taskImages: {
      type: [String],
      default: [],
    },

    referenceLink: String,

    ratingByTL: {
      type: Number,
      min: 1,
      max: 5,
    },

    slaStatus: {
      type: String,
      enum: ["SAFE", "AT_RISK", "OVERDUE"],
      default: "SAFE",
      index: true,
    },

    aiRiskLevel: {
      type: String,
      enum: ["SAFE", "AT_RISK", "HIGH_RISK"],
      default: "SAFE",
    },

    deadlineAt: Date,
  },
  { timestamps: true }
);

TaskSchema.index({ organizationId: 1, status: 1 });
TaskSchema.index({ assignedTo: 1, status: 1 });
TaskSchema.index({ clientId: 1, status: 1 });
TaskSchema.index({ workshopId: 1, status: 1 });
TaskSchema.index({ workshopId: 1, assignedTo: 1 });

export default mongoose.model<ITask>("Task", TaskSchema);