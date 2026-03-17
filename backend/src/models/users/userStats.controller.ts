import { Request, Response } from "express";
import { getUserStats } from "./userStats.service";

export const fetchUserStats = async (
  req: Request,
  res: Response
) => {

  try {

    if(!req.user)
      return res.status(401).json({success:false});

    const userId = req.params.userId;

    const stats = await getUserStats(
      userId as string,
      req.user.organizationId.toString()
    );

    res.json({
      success:true,
      data:stats
    });

  } catch(error:any){

    res.status(400).json({
      success:false,
      message:error.message
    });

  }

};