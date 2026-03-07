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