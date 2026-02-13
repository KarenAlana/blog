export interface ConteudoBloco {
  type:
    | "paragrafo"
    | "titulo"
    | "subtitulo"
    | "imagem"
    | "codigo"
    | "lista"
    | "citacao";
  content: string;
  nivel?: number; // Para títulos (1-6)
}

export interface Post {
  id: string;
  title: string;
  category: string;
  tags: string[];
  image: string;
  date: string;
  readingTime: string;
  excerpt: string;
  conteudo: ConteudoBloco[];
}

export interface CreatePostRequest {
  title: string;
  category: string;
  tags: string[];
  image?: string; // URL da imagem (será sobrescrita se upload)
  excerpt: string;
  conteudo: ConteudoBloco[];
  readingTime?: string; // Se não fornecido, será calculado
}

export interface UpdatePostRequest {
  title?: string;
  category?: string;
  tags?: string[];
  image?: string;
  excerpt?: string;
  conteudo?: ConteudoBloco[];
  readingTime?: string;
}
