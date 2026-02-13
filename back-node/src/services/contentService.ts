import {
  ContentBlock,
  ImageContent,
  TitleContent,
  CodeContent,
  CodeExample,
} from "../types/content.js";

/**
 * Serviço para validar e manipular blocos de conteúdo
 * Corresponde aos componentes ContentEditor e ContentBlockList do frontend
 */

// ===========================
// Validções de blocos
// ===========================

export function validateImageBlock(content: any): content is ImageContent {
  return (
    (typeof content === "object" &&
      typeof content.src === "string" &&
      typeof content.alt === "string" &&
      typeof content.width === "number") || //opcional mas podemos verificar tipo
    content.width === undefined
  );
}

export function validateTitleBlock(content: any): content is TitleContent {
  return typeof content === "object" && typeof content.text === "string";
}

export function validateCodeBlock(content: any): content is CodeContent {
  return (
    typeof content === "object" &&
    Array.isArray(content.examples) &&
    content.examples.every(
      (ex: any) =>
        typeof ex.language === "string" && typeof ex.code === "string",
    )
  );
}

export function validateContentBlock(block: any): block is ContentBlock {
  if (!block || typeof block !== "object" || !block.tipo || !block.content) {
    return false;
  }

  switch (block.tipo) {
    case "imagem":
      return validateImageBlock(block.content);
    case "titulo":
      return validateTitleContent(block.content);
    case "codigo":
      return validateCodeBlock(block.content);
    case "intro":
    case "conclusao":
    case "paragrafo":
      return typeof block.content === "string";
    default:
      return typeof block.content === "string";
  }
}

export function validateTitleContent(content: any): content is TitleContent {
  return typeof content === "object" && typeof content.text === "string";
}

// ===========================
// Transformações de blocos
// ===========================

/**
 * Converte um ContentBlock em HTML simples para visualização
 */
export function contentBlockToHtml(block: ContentBlock): string {
  switch (block.tipo) {
    case "titulo":
      const title = block.content as TitleContent;
      return `<h2>${title.text}</h2>`;

    case "imagem":
      const img = block.content as ImageContent;
      return `<img src="${img.src}" alt="${img.alt}" width="${img.width ?? "auto"}" height="${img.height ?? "auto"}" class="${img.class ?? ""}" />`;

    case "codigo":
      const code = block.content as CodeContent;
      return `<pre><code>${code.examples
        .map(
          (ex) =>
            `<span class="language-${ex.language}">${escapeHtml(ex.code)}</span>`,
        )
        .join("")}</code></pre>`;

    case "intro":
    case "conclusao":
    case "paragrafo":
    default:
      return `<p>${escapeHtml(block.content as string)}</p>`;
  }
}

/**
 * Calcula tempo de leitura baseado no conteúdo
 * 200 palavras por minuto é o padrão
 */
export function calculateReadingTime(blocks: ContentBlock[]): string {
  let totalWords = 0;

  blocks.forEach((block) => {
    if (block.tipo === "titulo") {
      const t = block.content as TitleContent;
      totalWords += t.text.split(" ").length;
    } else if (block.tipo === "codigo") {
      // Código começo muito mais rápido, conta menos
      const c = block.content as CodeContent;
      const codeWords = c.examples.reduce(
        (sum, ex) => sum + ex.code.split(" ").length,
        0,
      );
      totalWords += codeWords * 0.5; // 50% do peso
    } else if (typeof block.content === "string") {
      totalWords += block.content.split(" ").length;
    }
  });

  const minutes = Math.ceil(totalWords / 200);
  return `${minutes} min de leitura`;
}

/**
 * Valida um array completo de blocos de conteúdo
 */
export function validateContentBlocks(blocks: any[]): blocks is ContentBlock[] {
  return Array.isArray(blocks) && blocks.every(validateContentBlock);
}

/**
 * Ordena blocos de conteúdo (move para cima/baixo)
 */
export function moveContentBlock(
  blocks: ContentBlock[],
  index: number,
  direction: "up" | "down",
): ContentBlock[] {
  if (
    (direction === "up" && index === 0) ||
    (direction === "down" && index === blocks.length - 1)
  ) {
    return blocks;
  }

  const newBlocks = [...blocks];
  const targetIndex = direction === "up" ? index - 1 : index + 1;
  [newBlocks[index], newBlocks[targetIndex]] = [
    newBlocks[targetIndex],
    newBlocks[index],
  ];

  return newBlocks;
}

/**
 * Remove um bloco de conteúdo pelo índice
 */
export function removeContentBlock(
  blocks: ContentBlock[],
  index: number,
): ContentBlock[] {
  return blocks.filter((_, i) => i !== index);
}

/**
 * Adiciona um novo bloco de conteúdo
 */
export function addContentBlock(
  blocks: ContentBlock[],
  newBlock: ContentBlock,
): ContentBlock[] {
  if (!validateContentBlock(newBlock)) {
    throw new Error("Bloco de conteúdo inválido");
  }
  return [...blocks, newBlock];
}

/**
 * Atualiza um bloco de conteúdo específico
 */
export function updateContentBlock(
  blocks: ContentBlock[],
  index: number,
  updatedBlock: ContentBlock,
): ContentBlock[] {
  if (index < 0 || index >= blocks.length) {
    throw new Error("Índice de bloco inválido");
  }
  if (!validateContentBlock(updatedBlock)) {
    throw new Error("Bloco de conteúdo inválido");
  }

  const newBlocks = [...blocks];
  newBlocks[index] = updatedBlock;
  return newBlocks;
}

// ===========================
// Utilitários
// ===========================

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Lista de categorias disponíveis (mesmo que no frontend)
 */
export const AVAILABLE_CATEGORIES = [
  "Programação",
  "Tecnologia",
  "Design",
  "Negócios",
];

/**
 * Lista de tipos de blocos disponíveis
 */
export const AVAILABLE_CONTENT_TYPES = [
  "intro",
  "imagem",
  "titulo",
  "codigo",
  "conclusao",
  "paragrafo",
];

/**
 * Valida se uma categoria é válida
 */
export function isValidCategory(category: string): boolean {
  return AVAILABLE_CATEGORIES.includes(category);
}

/**
 * Valida se um tipo de bloco é válido
 */
export function isValidContentType(type: string): boolean {
  return AVAILABLE_CONTENT_TYPES.includes(type);
}
