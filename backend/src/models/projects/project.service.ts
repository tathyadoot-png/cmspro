import Project from "./project.model";
import Client from "../clients/client.model";
import { IUser } from "../users/user.model";

class ProjectService {

  async createProject(data: any, currentUser: IUser) {

    // Ensure client belongs to same org
    const client = await Client.findOne({
      _id: data.clientId,
      organizationId: currentUser.organizationId,
    });

    if (!client)
      throw new Error("Client not found");

    const project = await Project.create({
      organizationId: currentUser.organizationId,
      clientId: data.clientId,
      title: data.title,
      description: data.description,
      budget: data.budget,
      deadline: data.deadline,
      assignedTeam: data.assignedTeam,
      priority: data.priority,
    });

    return project;
  }

  async getProjects(currentUser: IUser) {
    return Project.find({
      organizationId: currentUser.organizationId,
    })
      .populate("clientId", "name clientType")
      .sort({ createdAt: -1 });
  }
}

export default new ProjectService();