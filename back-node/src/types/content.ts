// ===========================
// Tipos para ConteudoBlock
// ===========================

export interface ImageContent {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  class?: string;
}

export interface TitleContent {
  text: string;
  icon?: string;
  iconColor?: string;
}

export interface CodeExample {
  language: string;
  color?: string;
  code: string;
}

export interface CodeContent {
  title?: string;
  examples: CodeExample[];
}

// Union type para todos os tipos de blocos (seguindo o frontend)
export type ContentBlock =
  | { tipo: "imagem"; content: ImageContent }
  | { tipo: "titulo"; content: TitleContent }
  | { tipo: "codigo"; content: CodeContent }
  | { tipo: "intro" | "conclusao" | "paragrafo" | string; content: string };

// ===========================
// Interface para Post
// ===========================

export interface Post {
  id: string;
  title: string;
  category: string;
  tags: string[];
  image: string;
  date: string;
  readingTime: string;
  excerpt: string;
  conteudo: ContentBlock[];
}

export interface CreatePostRequest {
  title: string;
  category: string;
  tags: string[];
  image?: string; // URL ou será feito upload
  excerpt: string;
  conteudo: ContentBlock[];
  readingTime?: string; // Calculado automaticamente se não fornecido
}

export interface UpdatePostRequest {
  title?: string;
  category?: string;
  tags?: string[];
  image?: string;
  excerpt?: string;
  conteudo?: ContentBlock[];
  readingTime?: string;
}

// ===========================
// Tipos auxiliares
// ===========================

export interface BlogPost extends Post {
  // Estende Post com campos adicionais se necessário
}
