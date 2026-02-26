import mongoose, { Schema, Document, Types } from "mongoose";

export type ProjectStatus =
  | "ACTIVE"
  | "ON_HOLD"
  | "COMPLETED"
  | "CANCELLED";

export type ProjectPriority =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "URGENT";

export interface IProject extends Document {
  organizationId: Types.ObjectId;
  clientId: Types.ObjectId;
  title: string;
  description?: string;
  budget?: number;
  deadline?: Date;
  assignedTeam?: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  isActive: boolean;
}

const ProjectSchema = new Schema<IProject>(
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

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: String,

    budget: Number,

    deadline: Date,

    assignedTeam: String,

    status: {
      type: String,
      enum: ["ACTIVE", "ON_HOLD", "COMPLETED", "CANCELLED"],
      default: "ACTIVE",
    },

    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
      default: "MEDIUM",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

ProjectSchema.index({ organizationId: 1, clientId: 1 });

export default mongoose.model<IProject>("Project", ProjectSchema);