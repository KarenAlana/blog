import { useEffect, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface Post {
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

interface UseFetchPostsResult {
  posts: Post[];
  loading: boolean;
  error: string | null;
}

// Mapear dados do banco (snake_case) para o frontend (camelCase)
function mapPostData(data: any): Post {
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

export function useFetchPosts(): UseFetchPostsResult {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/api/posts`);

        if (!response.ok) {
          throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        // Mapear dados recebidos
        const mappedPosts = (data || []).map(mapPostData);
        console.log("Posts carregados:", mappedPosts);
        setPosts(mappedPosts);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erro desconhecido ao buscar posts";
        console.error("Erro ao buscar posts:", err);
        setError(errorMessage);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return { posts, loading, error };
}
