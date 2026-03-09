import Workshop from "./workshops.model";
import Client from "../clients/client.model";
import { IUser } from "../users/user.model";
import { generateWorkshopCode } from "../../utils/generateWorkshopCode";
import mongoose from "mongoose";

class WorkshopService {

  async createWorkshop(data: any, currentUser: IUser) {

    const client = await Client.findOne({
      _id: data.clientId,
      organizationId: currentUser.organizationId,
    });

    if (!client)
      throw new Error("Client not found");

    const members = [
      ...(data.teamLeads || []),
      ...(data.writers || []),
      ...(data.editors || [])
    ];

    const workshop = await Workshop.create({

      workshopCode: generateWorkshopCode(),

      organizationId: currentUser.organizationId,

      clientId: data.clientId,

      workshopName: data.workshopName,

      description: data.description,

      teamLeads: data.teamLeads || [],

      writers: data.writers || [],

      editors: data.editors || [],

      members,

      budget: data.budget,

      deadline: data.deadline,

      priority: data.priority,
    });

    return workshop;
  }

  async getWorkshops(currentUser: IUser) {

    const query: any = {
      organizationId: currentUser.organizationId
    };

    const isAdmin = currentUser.roles?.some(
      (r: any) => r.name === "ADMIN" || r.name === "SUPER_ADMIN"
    );

    if (!isAdmin) {
      query.members = currentUser._id;
    }

    return Workshop.find(query)
      .populate("clientId", "name clientType")
      .populate("teamLeads", "name userCode")
      .populate("writers", "name userCode")
      .populate("editors", "name userCode")
      .sort({ createdAt: -1 });
  }

 async getWorkshopById(id:string,currentUser:IUser){

const workshop = await Workshop.findOne({
_id:id,
organizationId:currentUser.organizationId
})
.populate("members","name")
.populate("writers","name")
.populate("editors","name")
.populate("teamLeads","name");

if(!workshop)
throw new Error("Workshop not found");

return workshop;

}

  async addMembers(workshopId: string, members: string[], currentUser: IUser) {

    const workshop = await Workshop.findOne({
      _id: workshopId,
      organizationId: currentUser.organizationId
    });

    if (!workshop)
      throw new Error("Workshop not found");

  workshop.members = [
  ...new Set([
    ...workshop.members.map(m => m.toString()),
    ...members
  ])
].map(id => new mongoose.Types.ObjectId(id));

    await workshop.save();

    return workshop;

  }

}

export default new WorkshopService();