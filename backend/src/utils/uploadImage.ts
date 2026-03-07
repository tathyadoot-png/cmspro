import cloudinary from "./cloudinary";

export const uploadImage = async(file:string)=>{

 const result = await cloudinary.uploader.upload(file,{
  folder:"workshop-chat"
 });

 return result.secure_url;

};