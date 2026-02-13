import express, { Router, Request, Response } from "express";
import { supabase } from "../config/supabase.js";
import { upload } from "../middleware/upload.js";
import { CreatePostRequest, UpdatePostRequest } from "../types/content.js";
import {
  validateCreatePostData,
  sanitizeCreatePostData,
  preparePostData,
  validateUpdatePostData,
  sanitizeUpdatePostData,
} from "../services/postValidator.js";
import { calculateReadingTime } from "../services/contentService.js";

const router = Router();

// Get all posts
router.get("/", async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("date", { ascending: false });

    if (error) throw error;

    res.json(data || []);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get post by id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Post not found" });

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get posts by category
router.get("/categoria/:categoria", async (req: Request, res: Response) => {
  try {
    const { categoria } = req.params;
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("category", categoria)
      .order("date", { ascending: false });

    if (error) throw error;

    res.json(data || []);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create post
router.post(
  "/",
  upload.single("image"),
  async (req: Request, res: Response) => {
    try {
      // Preparar dados do request
      const requestData: any = {
        ...req.body,
        image: req.file ? req.file.path : req.body.image,
      };

      // Converter conteudo se for string JSON
      if (typeof requestData.conteudo === "string") {
        try {
          requestData.conteudo = JSON.parse(requestData.conteudo);
        } catch {
          return res.status(400).json({
            error: "conteudo deve ser um JSON válido",
          });
        }
      }

      // Converter tags se for string JSON
      if (typeof requestData.tags === "string") {
        try {
          requestData.tags = JSON.parse(requestData.tags);
        } catch {
          requestData.tags = requestData.tags
            .split(",")
            .map((t: string) => t.trim());
        }
      }

      // Validar dados
      const validation = validateCreatePostData(requestData);
      if (!validation.valid) {
        return res.status(400).json({
          error: "Validação falhou",
          details: validation.errors,
        });
      }

      // Sanitizar dados
      const sanitized = sanitizeCreatePostData(requestData);

      // Preparar para salvar
      const postData = preparePostData(sanitized);

      // Salvar no banco
      const { data, error } = await supabase
        .from("posts")
        .insert([postData])
        .select()
        .single();

      if (error) throw error;

      res.status(201).json(data);
    } catch (error: any) {
      console.error("Erro ao criar post:", error);
      res.status(500).json({ error: error.message });
    }
  },
);

// Update post
router.put(
  "/:id",
  upload.single("image"),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      // Preparar dados do request
      const requestData: any = {
        ...req.body,
      };

      // Se houver imagem, adicionar
      if (req.file) {
        requestData.image = req.file.path;
      }

      // Converter conteudo se for string JSON
      if (requestData.conteudo && typeof requestData.conteudo === "string") {
        try {
          requestData.conteudo = JSON.parse(requestData.conteudo);
        } catch {
          return res.status(400).json({
            error: "conteudo deve ser um JSON válido",
          });
        }
      }

      // Converter tags se for string JSON
      if (requestData.tags && typeof requestData.tags === "string") {
        try {
          requestData.tags = JSON.parse(requestData.tags);
        } catch {
          requestData.tags = requestData.tags
            .split(",")
            .map((t: string) => t.trim());
        }
      }

      // Validar dados
      const validation = validateUpdatePostData(requestData);
      if (!validation.valid) {
        return res.status(400).json({
          error: "Validação falhou",
          details: validation.errors,
        });
      }

      // Sanitizar dados
      const sanitized = sanitizeUpdatePostData(requestData);

      // Recalcular tempo de leitura se conteudo foi atualizado
      if (sanitized.conteudo && !sanitized.readingTime) {
        sanitized.readingTime = calculateReadingTime(sanitized.conteudo);
      }

      // Mapear para snake_case para o banco de dados
      const dbData: any = {};
      if (sanitized.title !== undefined) dbData.title = sanitized.title;
      if (sanitized.category !== undefined)
        dbData.category = sanitized.category;
      if (sanitized.tags !== undefined) dbData.tags = sanitized.tags;
      if (sanitized.image !== undefined) dbData.image = sanitized.image;
      if (sanitized.excerpt !== undefined) dbData.excerpt = sanitized.excerpt;
      if (sanitized.conteudo !== undefined)
        dbData.conteudo = sanitized.conteudo;
      if (sanitized.readingTime !== undefined)
        dbData.reading_time = sanitized.readingTime;

      // Atualizar no banco
      const { data, error } = await supabase
        .from("posts")
        .update(dbData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      if (!data) {
        return res.status(404).json({ error: "Post não encontrado" });
      }

      res.json(data);
    } catch (error: any) {
      console.error("Erro ao atualizar post:", error);
      res.status(500).json({ error: error.message });
    }
  },
);

// Delete post
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("posts").delete().eq("id", id);

    if (error) throw error;

    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
