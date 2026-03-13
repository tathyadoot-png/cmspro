import {Request,Response} from "express";
import messageService from "./messages.service";

export const sendMessage = async(req:Request,res:Response)=>{

try{

if(!req.user)
return res.status(401).json({success:false});

const message = await messageService.sendMessage(
req.body,
req.user
);

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


export const getMessagesByWorkshop = async(
req:Request,
res:Response
)=>{

try{

if(!req.user)
return res.status(401).json({success:false});

const messages = await messageService.getMessagesByWorkshop(
req.params.id as string,
req.user
);

res.json({
success:true,
data:messages
});

}catch(error:any){

res.status(400).json({
success:false,
message:error.message
});

}

};