import {
  calculateReadingTime,
  validateContentBlocks,
  isValidCategory,
} from "../services/contentService.js";
import { CreatePostRequest, UpdatePostRequest } from "../types/content.js";

/**
 * Validar dados de criação de post
 * Corresponde à validação do formulário do frontend
 */
export function validateCreatePostData(data: any): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validar title
  if (!data.title || typeof data.title !== "string") {
    errors.push("title é obrigatório e deve ser string");
  } else if (data.title.trim().length === 0) {
    errors.push("title não pode estar vazio");
  } else if (data.title.length > 200) {
    errors.push("title não pode ter mais de 200 caracteres");
  }

  // Validar category
  if (!data.category || typeof data.category !== "string") {
    errors.push("category é obrigatória e deve ser string");
  } else if (!isValidCategory(data.category)) {
    errors.push(`category deve ser uma das opções válidas`);
  }

  // Validar tags
  if (data.tags) {
    if (!Array.isArray(data.tags)) {
      errors.push("tags deve ser um array");
    } else if (data.tags.length > 20) {
      errors.push("tags não pode ter mais de 20 itens");
    } else if (!data.tags.every((t: any) => typeof t === "string")) {
      errors.push("todas as tags devem ser strings");
    }
  }

  // Validar image
  if (
    !data.image ||
    (typeof data.image !== "string" && !isImageFile(data.image))
  ) {
    errors.push("image é obrigatória (URL ou arquivo)");
  } else if (typeof data.image === "string" && data.image.length > 500) {
    errors.push("URL da image não pode ter mais de 500 caracteres");
  }

  // Validar excerpt
  if (!data.excerpt || typeof data.excerpt !== "string") {
    errors.push("excerpt é obrigatória e deve ser string");
  } else if (data.excerpt.trim().length === 0) {
    errors.push("excerpt não pode estar vazia");
  } else if (data.excerpt.length > 500) {
    errors.push("excerpt não pode ter mais de 500 caracteres");
  }

  // Validar conteudo (validação desligada - apenas comentada)
  // if (!data.conteudo) {
  //   errors.push("conteudo é obrigatório");
  // } else if (!Array.isArray(data.conteudo)) {
  //   errors.push("conteudo deve ser um array");
  // } else if (data.conteudo.length === 0) {
  //   errors.push("conteudo deve ter pelo menos um bloco");
  // } else if (!validateContentBlocks(data.conteudo)) {
  //   errors.push("alguns blocos de conteudo são inválidos");
  // }

  // Validar readingTime (opcional)
  if (data.readingTime && typeof data.readingTime !== "string") {
    errors.push("readingTime deve ser string");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Sanitizar dados de criação de post
 */
export function sanitizeCreatePostData(data: any): CreatePostRequest {
  return {
    title: String(data.title).trim().slice(0, 200),
    category: String(data.category),
    tags: Array.isArray(data.tags)
      ? data.tags.map((t: any) => String(t).trim()).slice(0, 20)
      : [],
    image: String(data.image).trim().slice(0, 500),
    excerpt: String(data.excerpt).trim().slice(0, 500),
    conteudo: Array.isArray(data.conteudo) ? data.conteudo : [],
    readingTime: data.readingTime ? String(data.readingTime).trim() : undefined,
  };
}

/**
 * Preparar dados para salvar no banco
 */
export function preparePostData(request: CreatePostRequest) {
  const readingTime =
    request.readingTime || calculateReadingTime(request.conteudo);

  return {
    title: request.title,
    category: request.category,
    tags: request.tags,
    image: request.image,
    excerpt: request.excerpt,
    conteudo: request.conteudo,
    reading_time: readingTime,
    date: new Date().toISOString(),
  };
}

/**
 * Validar dados de atualização de post
 */
export function validateUpdatePostData(data: any): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Todos os campos são opcionais em UPDATE
  if (data.title !== undefined) {
    if (typeof data.title !== "string") {
      errors.push("title deve ser string");
    } else if (data.title.length > 200) {
      errors.push("title não pode ter mais de 200 caracteres");
    }
  }

  if (data.category !== undefined) {
    if (typeof data.category !== "string") {
      errors.push("category deve ser string");
    } else if (!isValidCategory(data.category)) {
      errors.push("category deve ser uma das opções válidas");
    }
  }

  if (data.tags !== undefined) {
    if (!Array.isArray(data.tags)) {
      errors.push("tags deve ser um array");
    } else if (data.tags.length > 20) {
      errors.push("tags não pode ter mais de 20 itens");
    }
  }

  // Validação de conteudo desligada (apenas comentada)
  // if (data.conteudo !== undefined) {
  //   if (!Array.isArray(data.conteudo)) {
  //     errors.push("conteudo deve ser um array");
  //   } else if (data.conteudo.length === 0) {
  //     errors.push("conteudo deve ter pelo menos um bloco");
  //   } else if (!validateContentBlocks(data.conteudo)) {
  //     errors.push("alguns blocos de conteudo são inválidos");
  //   }
  // }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Sanitizar dados de atualização
 */
export function sanitizeUpdatePostData(data: any): UpdatePostRequest {
  const sanitized: UpdatePostRequest = {};

  if (data.title !== undefined) {
    sanitized.title = String(data.title).trim().slice(0, 200);
  }
  if (data.category !== undefined) {
    sanitized.category = String(data.category);
  }
  if (data.tags !== undefined) {
    sanitized.tags = Array.isArray(data.tags)
      ? data.tags.map((t: any) => String(t).trim()).slice(0, 20)
      : [];
  }
  if (data.image !== undefined) {
    sanitized.image = String(data.image).trim().slice(0, 500);
  }
  if (data.excerpt !== undefined) {
    sanitized.excerpt = String(data.excerpt).trim().slice(0, 500);
  }
  if (data.conteudo !== undefined) {
    sanitized.conteudo = Array.isArray(data.conteudo) ? data.conteudo : [];
  }
  if (data.readingTime !== undefined) {
    sanitized.readingTime = String(data.readingTime).trim();
  }

  return sanitized;
}

// ===========================
// Utilitários privados
// ===========================

function isImageFile(file: any): boolean {
  return file && typeof file === "object" && file.path && file.filename;
}
