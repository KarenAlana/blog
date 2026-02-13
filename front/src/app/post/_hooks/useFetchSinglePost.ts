import { useEffect, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface PostData {
  id: string;
  title: string;
  category: string;
  tags: string[];
  image: string;
  date: string;
  readingTime: string;
  excerpt: string;
  conteudo: any[];
}

interface UseFetchSinglePostResult {
  postData: PostData | null;
  loading: boolean;
  error: string | null;
}

// Mapear dados do banco (snake_case) para o frontend (camelCase)
function mapPostData(data: any): PostData {
  return {
    id: data.id,
    title: data.title,
    category: data.category,
    tags: data.tags || [],
    image: data.image || "",
    date: data.date
      ? new Date(data.date).toLocaleDateString("pt-BR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "",
    readingTime: data.reading_time || data.readingTime || "5 min",
    excerpt: data.excerpt,
    conteudo: data.conteudo || [],
  };
}

export function useFetchSinglePost(id: string): UseFetchSinglePostResult {
  const [postData, setPostData] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("ID do post não fornecido");
      setLoading(false);
      return;
    }

    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/api/posts/${id}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Post não encontrado");
          }
          throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // A resposta vem como {...} ou { postData: {...} }
        const postResponse = data.postData || data;
        const mappedPost = mapPostData(postResponse);
        setPostData(mappedPost);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erro desconhecido ao buscar post";
        console.error("Erro ao buscar post:", err);
        setError(errorMessage);
        setPostData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  return { postData, loading, error };
}
