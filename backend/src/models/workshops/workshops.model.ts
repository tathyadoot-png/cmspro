import mongoose, { Schema, Document, Types } from "mongoose";

export type WorkshopStatus =
  | "ACTIVE"
  | "ON_HOLD"
  | "COMPLETED"
  | "CANCELLED";

export type WorkshopPriority =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "URGENT";

export interface IWorkshop extends Document {

  workshopCode: string;   // WS-2391

  organizationId: Types.ObjectId;

  clientId: Types.ObjectId;

  workshopName: string;

  description?: string;

  teamLeads: Types.ObjectId[];

  writers: Types.ObjectId[];

  editors: Types.ObjectId[];

  members: Types.ObjectId[];

  budget?: number;

  deadline?: Date;

  status: WorkshopStatus;

  priority: WorkshopPriority;

  isActive: boolean;

  createdBy: Types.ObjectId;

}

const WorkshopSchema = new Schema<IWorkshop>(
  {

    workshopCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

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

    workshopName: {
      type: String,
      required: true,
      trim: true,
    },

    description: String,

    teamLeads: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    writers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    editors: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        index: true
      },
    ],

    budget: Number,

    deadline: Date,

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

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

  },
  { timestamps: true }
);

WorkshopSchema.index({ organizationId: 1, clientId: 1 });

export default mongoose.model<IWorkshop>("Workshop", WorkshopSchema);