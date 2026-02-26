import mongoose, { Schema, Document, Types } from "mongoose";

export type ClientType = "POLITICAL" | "CORPORATE";

export interface IClient extends Document {
  organizationId: Types.ObjectId;
  name: string;
  clientType: ClientType;
  teamLeads: Types.ObjectId[];
  isActive: boolean;
}

const ClientSchema = new Schema<IClient>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    clientType: {
      type: String,
      enum: ["POLITICAL", "CORPORATE"],
      required: true,
    },

    teamLeads: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

ClientSchema.index({ organizationId: 1, name: 1 });

export default mongoose.model<IClient>("Client", ClientSchema);