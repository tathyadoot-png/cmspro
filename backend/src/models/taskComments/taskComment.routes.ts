import { Router } from "express";
import {
  addComment,
  fetchComments
} from "./taskComment.controller";

import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.post(
  "/",
  authMiddleware,
  addComment
);

router.get(
  "/:taskId",
  authMiddleware,
  fetchComments
);

export default router;