import Workshop from "./workshops.model";
import Client from "../clients/client.model";
import { IUser } from "../users/user.model";
import { generateWorkshopCode } from "../../utils/generateWorkshopCode";
import mongoose from "mongoose";
import Task from "../tasks/task.model";

class WorkshopService {

  async createWorkshop(data: any, currentUser: IUser) {

    const client = await Client.findOne({
      _id: data.clientId,
      organizationId: currentUser.organizationId,
    });

    if (!client)
      throw new Error("Client not found");

 const members = Array.from(new Set([
  ...(data.teamLeads || []),
  ...(data.writers || []),
  ...(data.editors || [])
]));
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
  .populate("members", "name userCode")   // 👈 ADD THIS
  .sort({ createdAt: -1 });
  }

async getWorkshopById(id:string,currentUser:IUser){

const workshop = await Workshop.findOne({
_id:id,
organizationId:currentUser.organizationId
})
.populate("members","name userCode")
.populate("writers","name userCode")
.populate("editors","name userCode")
.populate("teamLeads","name userCode");

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

async getWorkshopStats(workshopId: string, currentUser: IUser) {

  const workshop = await Workshop.findOne({
    _id: workshopId,
    organizationId: currentUser.organizationId
  });

  if (!workshop)
    throw new Error("Workshop not found");

  const tasks = await Task.find({
    workshopId,
    organizationId: currentUser.organizationId
  });

  const totalTasks = tasks.length;

  const completed = tasks.filter(
  t => t.status === "APPROVED"
).length;

  const inProgress = tasks.filter(
    t => t.status === "IN_PROGRESS"
  ).length;

  const overdue = tasks.filter(
    t => t.slaStatus === "OVERDUE"
  ).length;

  return {
    totalTasks,
    completed,
    inProgress,
    overdue,
    members: workshop.members.length
  };

}
  
async assignTeamLead(
  workshopId:string,
  userId:string,
  currentUser:IUser
){

  const workshop = await Workshop.findOne({
    _id:workshopId,
    organizationId:currentUser.organizationId
  })

  if(!workshop)
    throw new Error("Workshop not found")

  if(!workshop.members.some(m=>m.toString()===userId))
    throw new Error("User must be workshop member")

  workshop.teamLeads = [
    ...new Set([
      ...workshop.teamLeads.map(t=>t.toString()),
      userId
    ])
  ].map(id=>new mongoose.Types.ObjectId(id))

  await workshop.save()

  return workshop

}


async updateWorkshop(
  workshopId: string,
  data: any,
  currentUser: IUser
) {
  const workshop = await Workshop.findOne({
    _id: workshopId,
    organizationId: currentUser.organizationId
  });

  if (!workshop)
    throw new Error("Workshop not found");

  if (data.workshopName) workshop.workshopName = data.workshopName;
  if (data.description) workshop.description = data.description;
  if (data.deadline) workshop.deadline = data.deadline;
  if (data.priority) workshop.priority = data.priority;

  await workshop.save();

  return workshop;
}



async deleteWorkshop(
  workshopId: string,
  currentUser: IUser
) {
  const workshop = await Workshop.findOne({
    _id: workshopId,
    organizationId: currentUser.organizationId
  });

  if (!workshop)
    throw new Error("Workshop not found");

  await Workshop.deleteOne({ _id: workshopId });
}




}

export default new WorkshopService();