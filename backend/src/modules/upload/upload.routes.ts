import { Router } from "express";
import multer from "multer";
import { uploadImage } from "../../utils/uploadImage";

const router = Router();

const upload = multer({
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB
});

router.post("/", upload.single("file"), async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File required"
      });
    }

    const url = await uploadImage(req.file.buffer);

    res.json({
      success: true,
      url
    });

  } catch (error) {

    console.error("UPLOAD ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Upload failed"
    });

  }
});

export default router;