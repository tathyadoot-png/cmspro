import { Request, Response } from "express";
import projectService from "./project.service";

export const createProject = async (req: Request, res: Response) => {
  try {

    if (!req.user)
      return res.status(401).json({ success: false });

    const project = await projectService.createProject(
      req.body,
      req.user
    );

    res.status(201).json({
      success: true,
      data: project,
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProjects = async (req: Request, res: Response) => {
  try {

    if (!req.user)
      return res.status(401).json({ success: false });

    const projects = await projectService.getProjects(req.user);

    res.json({
      success: true,
      data: projects,
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};