// src/modules/users/user.model.ts

import mongoose, { Schema, Document, Types } from "mongoose";

export type RatingTag = "BAD" | "OK" | "GOOD" | "VERY_GOOD";

export interface IUser extends Document {
  organizationId: Types.ObjectId;
  userCode: string;
  name: string;
  email: string;
  password: string;
  roles: Types.ObjectId[];
  isActive: boolean;
failedAttempts: number;
lockUntil?: Date;
  // Monitoring
  totalTasks: number;
  completedTasks: number;
  onTimeTasks: number;
  lateTasks: number;
  totalRevisions: number;
  averageCompletionMinutes: number;
  performanceScore: number;
  ratingTag: RatingTag;
  currentActiveTasks: number;
  lastTaskCompletedAt?: Date;
  consistencyScore: number;
permissions?: string[];
  lastLoginAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
failedAttempts: { type: Number, default: 0 },
lockUntil: { type: Date },
    userCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    roles: [
      {
        type: Schema.Types.ObjectId,
        ref: "Role",
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
currentActiveTasks: { type: Number, default: 0 },

lastTaskCompletedAt: Date,

consistencyScore: { type: Number, default: 0 },
    // Monitoring fields
    totalTasks: { type: Number, default: 0 },
    completedTasks: { type: Number, default: 0 },
    onTimeTasks: { type: Number, default: 0 },
    lateTasks: { type: Number, default: 0 },
    totalRevisions: { type: Number, default: 0 },
    averageCompletionMinutes: { type: Number, default: 0 },
    performanceScore: { type: Number, default: 0 },

    ratingTag: {
      type: String,
      enum: ["BAD", "OK", "GOOD", "VERY_GOOD"],
      default: "OK",
    },

    lastLoginAt: Date,
  },
  { timestamps: true }
);

/* Index Optimization */
UserSchema.index({ organizationId: 1, email: 1 });
UserSchema.index({ organizationId: 1, userCode: 1 });

export default mongoose.model<IUser>("User", UserSchema);