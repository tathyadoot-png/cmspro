// src/modules/organization/organization.model.ts

import mongoose, { Schema, Document } from "mongoose";

export interface IOrganization extends Document {
  name: string;
  shortCode: string;
  subscriptionPlan: string;
  isActive: boolean;
}

const OrganizationSchema = new Schema<IOrganization>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    shortCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    subscriptionPlan: {
      type: String,
      default: "STANDARD",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IOrganization>(
  "Organization",
  OrganizationSchema
);