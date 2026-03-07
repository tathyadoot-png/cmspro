import mongoose,{Schema,Document,Types} from "mongoose";

export interface IMessage extends Document{

 workshopId: Types.ObjectId;

 sender: Types.ObjectId;

 message?: string;

 image?: string;

 videoLink?: string;

}

const MessageSchema = new Schema({

 workshopId:{
  type:Schema.Types.ObjectId,
  ref:"Workshop",
  required:true
 },

 sender:{
  type:Schema.Types.ObjectId,
  ref:"User",
  required:true
 },

 message:String,

 image:String,

 videoLink:String

},{timestamps:true});

export default mongoose.model<IMessage>("Message",MessageSchema);