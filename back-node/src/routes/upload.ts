import express, { Router, Request, Response } from "express";
import { upload } from "../middleware/upload.js";

const router = Router();

// Upload de imagem (salva localmente em /uploads)
router.post(
  "/",
  upload.single("image"),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // URL acessível: /uploads/nome-do-arquivo (o front usa API_BASE_URL + path)
      const imageUrl = `/uploads/${req.file.filename}`;

      res.json({
        success: true,
        imageUrl,
        filename: req.file.filename,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
);

export default router;
