import { Router } from "express";
import Role from "./role.model";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.get("/",authMiddleware,async(req,res)=>{

 const roles = await Role.find();

 res.json({
  success:true,
  data:roles
 });

});

router.post("/",authMiddleware,async(req,res)=>{

 const role = await Role.create({
  name:req.body.name
 });

 res.json({
  success:true,
  data:role
 });

});

router.put("/:id",authMiddleware,async(req,res)=>{

 const role = await Role.findByIdAndUpdate(
  req.params.id,
  req.body,
  {new:true}
 );

 res.json({
  success:true,
  data:role
 });

});

router.delete("/:id",authMiddleware,async(req,res)=>{

 await Role.findByIdAndDelete(req.params.id);

 res.json({
  success:true
 });

});

export default router;