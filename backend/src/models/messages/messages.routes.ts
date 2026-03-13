import {Router} from "express";
import {sendMessage,getMessagesByWorkshop} from "./messages.controller";
import {authMiddleware} from "../../middleware/auth.middleware";

const router = Router();

router.post("/",authMiddleware,sendMessage);

router.get(
"/workshop/:id",
authMiddleware,
getMessagesByWorkshop
);

export default router;