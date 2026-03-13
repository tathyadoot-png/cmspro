import mongoose, { Schema, Document, Types } from "mongoose";

export interface IMessage extends Document {

  organizationId: Types.ObjectId;

  workshopId: Types.ObjectId;

  sender: Types.ObjectId;

  message: string;

}

const MessageSchema = new Schema<IMessage>(
  {

    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },

    workshopId: {
      type: Schema.Types.ObjectId,
      ref: "Workshop",
      required: true,
      index: true,
    },

    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

  },
  { timestamps: true }
);

export default mongoose.model<IMessage>("Message", MessageSchema);