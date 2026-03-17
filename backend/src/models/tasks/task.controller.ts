  // backend/src/models/tasks/task.controller.ts

  import { Request, Response } from "express";
  import taskService from "./task.service";


  export const createTask = async (req: Request, res: Response) => {

    try {

      if (!req.user) {
        return res.status(401).json({
          success:false,
          message:"Unauthorized"
        });
      }

      const task = await taskService.createTask(
        req.body,
        req.user
      );

      res.status(201).json({
        success:true,
        data:task
      });

    } catch(error:any){

      res.status(400).json({
        success:false,
        message:error.message
      });

    }

  };

  export const startTask = async (req: Request, res: Response) => {
    try {

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const task = await taskService.startTask(
        req.params.id as string,
        req.user   // now guaranteed IUser
      );

      res.json({ success: true, data: task });

    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };


  export const submitTask = async (req: Request, res: Response) => {
    try {

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const task = await taskService.submitTask(
        req.params.id as string,
        req.body.submissionData,
        req.user
      );

      res.json({ success: true, data: task });

    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  export const approveTask = async (req: Request, res: Response) => {
    try {

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const task = await taskService.approveTask(
        req.params.id as string,
        req.user
      );

      res.json({
        success: true,
        data: task,
      });

    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }


    
  };


  export const requestRevision = async (req: Request, res: Response) => {
    try {

      if (!req.user)
        return res.status(401).json({ success: false });

      const task = await taskService.requestRevision(
        req.params.id as string,
        req.user
      );

      res.json({
        success: true,
        data: task,
      });

    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };


export const getTasks = async (req: Request, res: Response) => {
  try {

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // 🔥 workshop filter
    const workshopId = req.query.workshopId as string | undefined;

    const tasks = await taskService.getTasks(
      req.user,
      workshopId
    );

    res.json({
      success: true,
      data: tasks,
    });

  } catch (error: any) {

    res.status(400).json({
      success: false,
      message: error.message,
    });

  }
};


export const updateTaskStatus = async (req: Request, res: Response) => {
  try {

    if (!req.user)
      return res.status(401).json({ success: false });

    // 🔥 FIX
    const taskId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const { status } = req.body;

    const task = await taskService.updateTaskStatus(
      taskId,
      status,
      req.user
    );

    res.json({
      success: true,
      data: task
    });

  } catch (error: any) {

    res.status(400).json({
      success: false,
      message: error.message
    });

  }
};

export const getTask = async (req: Request, res: Response) => {

  try {

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const taskId = req.params.id;

    const task = await taskService.getTask(
      taskId as string,
      req.user
    );

    res.json({
      success: true,
      data: task
    });

  } catch (error:any) {

    res.status(400).json({
      success:false,
      message:error.message
    });

  }

};