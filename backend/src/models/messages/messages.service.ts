import Message from "./message.model";

class MessageService{

 async sendMessage(data:any){

  const message = await Message.create(data);

  return message;

 }

 async getMessages(workshopId:string){

  return Message.find({workshopId})
  .populate("sender","name userCode")
  .sort({createdAt:1});

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