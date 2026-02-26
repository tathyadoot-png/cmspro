// src/modules/analytics/performanceSnapshot.model.ts

import mongoose, { Schema, Document, Types } from "mongoose";

export interface IPerformanceSnapshot extends Document {
  organizationId: Types.ObjectId;
  userId: Types.ObjectId;

  month: number;   // 1-12
  year: number;

  totalTasks: number;
  completedTasks: number;
  onTimeTasks: number;
  lateTasks: number;
  totalRevisions: number;

  averageCompletionMinutes: number;
  performanceScore: number;
  ratingTag: string;

  burnoutRisk: "LOW" | "MEDIUM" | "HIGH";
}

const SnapshotSchema = new Schema<IPerformanceSnapshot>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", index: true },

    month: Number,
    year: Number,

    totalTasks: Number,
    completedTasks: Number,
    onTimeTasks: Number,
    lateTasks: Number,
    totalRevisions: Number,

    averageCompletionMinutes: Number,
    performanceScore: Number,
    ratingTag: String,

    burnoutRisk: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
    },
  },
  { timestamps: true }
);

SnapshotSchema.index({ userId: 1, month: 1, year: 1 });

export default mongoose.model("PerformanceSnapshot", SnapshotSchema);