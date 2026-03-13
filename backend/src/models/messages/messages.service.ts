import Message from "./message.model";
import { IUser } from "../users/user.model";

class MessageService {

async sendMessage(data:any,user:IUser){

const message = await Message.create({

organizationId:user.organizationId,

workshopId:data.workshopId,

sender:user._id,

message:data.message

});

return message;

}


async getMessagesByWorkshop(workshopId:string,user:IUser){

return Message.find({
workshopId,
organizationId:user.organizationId
})
.populate("sender","name email")
.sort({createdAt:1});

}

}

export default new MessageService();