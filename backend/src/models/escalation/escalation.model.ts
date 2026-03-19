import mongoose, { Schema, Document, Types } from "mongoose";

export type EscalationStatus = "OPEN" | "RESOLVED";

export interface IEscalation extends Document {
  organizationId: Types.ObjectId;
  taskId: Types.ObjectId;
  escalatedTo: Types.ObjectId;
  reason: string;
  status: EscalationStatus;
  createdAt: Date;
  updatedAt: Date;
  triggerType: "DELAY" | "SLA_RISK";
}

const EscalationSchema = new Schema<IEscalation>(
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
    },
    escalatedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["OPEN", "RESOLVED"],
      default: "OPEN",
      index: true,
    },
    triggerType: {
  type: String,
  enum: ["DELAY", "SLA_RISK"],
  default: "DELAY",
},
  },
  { timestamps: true }
);

export default mongoose.model<IEscalation>(
  "Escalation",
  EscalationSchema
);