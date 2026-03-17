import { Router } from "express";
import { uploadImage } from "../../utils/uploadImage";

const router = Router();

router.post("/", async (req, res) => {

  try {

    const { file } = req.body;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "File required"
      });
    }

    const url = await uploadImage(file);

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