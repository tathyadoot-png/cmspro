import { Request, Response } from "express";
import workshopService from "./workshops.service";
import { emitActivity } from "../../utils/activity.engine";
import { ACTIVITY } from "../../constants/activityTypes"; 


export const createWorkshop = async (req: Request, res: Response) => {
  try {

    if (!req.user)
      return res.status(401).json({ success: false });

    const workshop = await workshopService.createWorkshop(
      req.body,
      req.user
    );

    // 🔥 Auto Activity Log
    await emitActivity({
      organizationId: req.user.organizationId,
      workshopId: workshop._id,
      userId: req.user._id,
      action: ACTIVITY.WORKSHOP_CREATED,
      message: `${req.user.name} created workshop "${workshop.workshopName}"`
    });

    res.status(201).json({
      success: true,
      data: workshop,
    });

  } catch (error: any) {

    res.status(400).json({
      success: false,
      message: error.message,
    });

  }
};

export const getWorkshops = async (req: Request, res: Response) => {

  try {

    if (!req.user)
      return res.status(401).json({ success: false });

    const workshops = await workshopService.getWorkshops(req.user);

    res.json({
      success: true,
      data: workshops,
    });

  } catch (error: any) {

    res.status(400).json({
      success: false,
      message: error.message,
    });

  }

};

export const getWorkshopById = async (req: Request, res: Response) => {

  try {

    if (!req.user)
      return res.status(401).json({ success: false });
    console.log("Workshop ID:", req.params.id);

    const workshop = await workshopService.getWorkshopById(
      req.params.id as string,
      req.user
    );

    res.json({
      success: true,
      data: workshop,
    });

  } catch (error: any) {
    console.log(error);

    res.status(400).json({
      success: false,
      message: error.message,
    });

  }

};

export const addMembers = async (req: Request, res: Response) => {

  try {

    if (!req.user)
      return res.status(401).json({ success: false });

    const workshop = await workshopService.addMembers(
      req.params.id as string,
      req.body.members,
      req.user
    );

    res.json({
      success: true,
      data: workshop,
    });

  } catch (error: any) {

    res.status(400).json({
      success: false,
      message: error.message,
    });

  }

};


export const getWorkshopStats = async (req: Request, res: Response) => {

  try {

    if (!req.user)
      return res.status(401).json({ success: false });

    const stats = await workshopService.getWorkshopStats(
      req.params.id as string,
      req.user
    );

    res.json({
      success: true,
      data: stats
    });

  } catch (error: any) {

    res.status(400).json({
      success: false,
      message: error.message
    });

  }

};

export const assignTeamLead = async (req:Request,res:Response)=>{

  try{

    if(!req.user)
      return res.status(401).json({success:false})

    const workshop = await workshopService.assignTeamLead(
      req.params.id as string ,
      req.body.userId,
      req.user
    )

    res.json({
      success:true,
      data:workshop
    })

  }catch(error:any){

    res.status(400).json({
      success:false,
      message:error.message
    })

  }

}