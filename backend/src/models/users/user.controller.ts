// backend/src/models/users/user.controller.ts

import { Request, Response } from "express";
import userService from "./user.service";

export const createUser = async (req: Request, res: Response) => {
  try {

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await userService.createUser(
      req.body,
      req.user
    );

    res.status(201).json({
      success: true,
      data: user,
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


export const getUsers = async (req: Request, res: Response) => {
  try {

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const users = await userService.getUsers(req.user);

    res.json({
      success: true,
      data: users
    });

  } catch (error: any) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

export const updateUser = async (req:Request,res:Response)=>{

 try{

const id = Array.isArray(req.params.id)
  ? req.params.id[0]
  : req.params.id;
  const user = await userService.updateUser(
    id,
    req.body,
    req.user
  );

  res.json({
    success:true,
    data:user
  });

 }catch(error:any){

  res.status(400).json({
    success:false,
    message:error.message
  });

 }

};

export const deleteUser = async (req:Request,res:Response)=>{

 try{

const id = Array.isArray(req.params.id)
  ? req.params.id[0]
  : req.params.id;
  await userService.deleteUser(
    id,
    req.user
  );

  res.json({
    success:true
  });

 }catch(error:any){

  res.status(400).json({
    success:false,
    message:error.message
  });

 }

};