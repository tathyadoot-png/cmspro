import {Request,Response} from "express";
import messageService from "./messages.service";

export const sendMessage = async(req:Request,res:Response)=>{

 try{

  const message = await messageService.sendMessage({
   workshopId:req.body.workshopId,
   sender:req.user?._id,
   message:req.body.message,
   image:req.body.image,
   videoLink:req.body.videoLink
  });

  res.json({
   success:true,
   data:message
  });

 }catch(error:any){

  res.status(400).json({
   success:false,
   message:error.message
  });

 }

};

export const getMessages = async(req:Request,res:Response)=>{

const workshopId = Array.isArray(req.params.id)
  ? req.params.id[0]
  : req.params.id;

const messages = await messageService.getMessages(workshopId);
 res.json({
  success:true,
  data:messages
 });

};

export const getMessagesByWorkshop = async (
  req: Request,
  res: Response
) => {
  try {

    if (!req.user)
      return res.status(401).json({ success: false });

    const messages = await messageService.getMessagesByWorkshop(
      req.params.id as string,
      req.user
    );

    res.json({
      success: true,
      data: messages,
    });

  } catch (error: any) {

    res.status(400).json({
      success: false,
      message: error.message,
    });

  }
};