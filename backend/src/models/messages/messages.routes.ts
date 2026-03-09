import {Router} from "express";
import {sendMessage,getMessages, getMessagesByWorkshop} from "./messages.controller";
import {authMiddleware} from "../../middleware/auth.middleware";

const router = Router();

router.post("/",authMiddleware,sendMessage);

router.get("/:id",authMiddleware,getMessages);
router.get(
  "/workshop/:id",
  authMiddleware,
  getMessagesByWorkshop
);

export default router;