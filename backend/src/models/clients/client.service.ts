import Client from "./client.model";
import { IUser } from "../users/user.model";

class ClientService {

  async createClient(data: any, currentUser: IUser) {

    const client = await Client.create({
      organizationId: currentUser.organizationId,
      name: data.name,
      clientType: data.clientType,
      teamLeads: data.teamLeads,
    });

    return client;
  }

  async getClients(currentUser: IUser) {
    return Client.find({
      organizationId: currentUser.organizationId,
    }).populate("teamLeads", "name email");
  }
}

export default new ClientService();