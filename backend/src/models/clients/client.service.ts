import Client from "./client.model";
import { IUser } from "../users/user.model";

class ClientService {
async createClient(data: any, currentUser: IUser) {

 if(!data.name){
   throw new Error("Client name required");
 }

 const client = await Client.create({
   organizationId: currentUser.organizationId,
   name: data.name,
   clientType: data.clientType || "CORPORATE",
   teamLeads: data.teamLeads || [],
 });

 return client;
}

  async getClients(currentUser: IUser) {
    return Client.find({
      organizationId: currentUser.organizationId,
    }).populate("teamLeads", "name email");
  }

async updateClient(id:string,data:any,currentUser:IUser){

 const client = await Client.findOneAndUpdate(
  {
   _id:id,
   organizationId:currentUser.organizationId
  },
  data,
  {new:true}
 );

 return client;
}

async deleteClient(id:string,currentUser:IUser){

 await Client.findOneAndDelete({
  _id:id,
  organizationId:currentUser.organizationId
 });

}


}

export default new ClientService();