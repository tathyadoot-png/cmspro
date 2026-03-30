import { Request, Response } from "express";
import workshopService from "./workshops.service";
import { emitActivity } from "../../utils/activity.engine";
import { ACTIVITY } from "../../constants/activityTypes"; 
import { logActivity } from "../audit/audit.service"; 

export const createWorkshop = async (req: Request, res: Response) => {
  try {

    if (!req.user)
      return res.status(401).json({ success: false });

    const workshop = await workshopService.createWorkshop(
      req.body,
      req.user
    );

    // 🔥 NEW CLEAN ACTIVITY LOG
    await logActivity({
      organizationId: req.user.organizationId,
      userId: req.user._id,
      actionType: "PROJECT_CREATED", // ✅ use existing enum
      targetType: "PROJECT",
      targetId: workshop._id,
      workshopId: workshop._id,
      metadata: {
        name: workshop.workshopName
      }
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


export const updateWorkshop = async (req: Request, res: Response) => {
  try {
    if (!req.user)
      return res.status(401).json({ success: false });

    const workshop = await workshopService.updateWorkshop(
      req.params.id as string,
      req.body,
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


export const deleteWorkshop = async (req: Request, res: Response) => {
  try {
    if (!req.user)
      return res.status(401).json({ success: false });

    await workshopService.deleteWorkshop(
      req.params.id as string,
      req.user
    );

    res.json({
      success: true,
      message: "Workshop deleted successfully",
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};