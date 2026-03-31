import Message from "./message.model";
import { IUser } from "../users/user.model";

class MessageService {

async sendMessage(data:any,user:IUser){

const message = await Message.create({

organizationId:user.organizationId,

workshopId:data.workshopId,

sender:user._id,

message:data.message,

type:"TEXT" // ✅ default

});

return message;

}


async getMessagesByWorkshop(workshopId:string,user:IUser){

return Message.find({
workshopId,
organizationId:user.organizationId
})
.populate("sender","name email")
.populate("metadata.assignedTo","name")
.populate("metadata.assignedBy","name")
.sort({createdAt:1});

}

async createTaskEventMessage({
  task,
  assignedTo,
  assignedBy,
}: any) {

  return Message.create({
    organizationId: task.organizationId,
    workshopId: task.workshopId,
    sender: assignedBy,
    type: "TASK_EVENT",
    message: `Task "${task.title}" assigned`,
    metadata: {
      taskId: task._id,
      assignedTo,
      assignedBy
    }
  });

}


}

export default new MessageService();