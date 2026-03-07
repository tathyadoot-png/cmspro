import {Router} from "express";
import {sendMessage,getMessages} from "./messages.controller";
import {authMiddleware} from "../../middleware/auth.middleware";

const router = Router();

router.post("/",authMiddleware,sendMessage);

router.get("/:id",authMiddleware,getMessages);

export default router;