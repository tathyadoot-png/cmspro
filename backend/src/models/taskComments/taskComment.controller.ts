import { Request, Response } from "express";
import { createComment, getTaskComments } from "./taskComment.service";
import { getIO } from "../../socket";

export const addComment = async (req: Request, res: Response) => {

  try {

    if (!req.user)
      return res.status(401).json({ success:false });

    const { taskId, message } = req.body;

    const comment = await createComment(
      req.user.organizationId.toString(),
      taskId,
      req.user._id.toString(),
      message
    );

    /* 🔥 Realtime Emit */

    const io = getIO();
    io.to(taskId).emit("NEW_COMMENT", comment);

    res.json({
      success:true,
      data:comment
    });

  } catch (error:any) {

    res.status(400).json({
      success:false,
      message:error.message
    });

  }

};

export const fetchComments = async (req: Request, res: Response) => {

  try {

    const taskId = Array.isArray(req.params.taskId)
      ? req.params.taskId[0]
      : req.params.taskId;

    const comments = await getTaskComments(taskId);

    res.json({
      success:true,
      data:comments
    });

  } catch (error:any) {

    res.status(400).json({
      success:false,
      message:error.message
    });

  }

};