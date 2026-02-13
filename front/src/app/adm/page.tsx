"use client";
import { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import PostMetadataForm from "./_components/PostMetadataForm";
import ContentEditor from "./_components/ContentEditor";
import ContentBlockList from "./_components/ContentBlockList";
import PostsTable from "./_components/PostsTable";
import PostPreviewWrapper from "./_components/PostPreviewWrapper";

// Tipos para blocos de conteúdo
interface ImageContent {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  class?: string;
}
interface TitleContent {
  text: string;
  icon?: string;
  iconColor?: string;
}
interface CodeExample {
  language: string;
  color?: string;
  code: string;
}
interface CodeContent {
  title?: string;
  examples: CodeExample[];
}
type ContentBlock =
  | { tipo: "imagem"; content: ImageContent }
  | { tipo: "titulo"; content: TitleContent }
  | { tipo: "codigo"; content: CodeContent }
  | { tipo: string; content: string };

interface FormData {
  title: string;
  category: string;
  tags: string[];
  image: string;
  excerpt: string;
  readingTime: string;
  conteudo: ContentBlock[];
}

// Tipos para post
interface BlogPost extends FormData {
  id: string;
  date: string;
}

const BlogAdmin = () => {
  // Estados do componente
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [mode, setMode] = useState("list"); // 'list', 'create', 'edit'
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    category: "Programação",
    tags: [],
    image: "",
    excerpt: "",
    readingTime: "5 min de leitura",
    conteudo: [],
  });
  const [currentContentType, setCurrentContentType] = useState<string>("intro");
  const [currentContent, setCurrentContent] = useState<string>("");

  const moveContentBlock = useCallback(
    (index: number, direction: "up" | "down") => {
      if (
        (direction === "up" && index === 0) ||
        (direction === "down" && index === formData.conteudo.length - 1)
      ) {
        return;
      }
      const newIndex = direction === "up" ? index - 1 : index + 1;
      const newConteudo = [...formData.conteudo];
      [newConteudo[index], newConteudo[newIndex]] = [
        newConteudo[newIndex],
        newConteudo[index],
      ];
      setFormData((prev) => ({
        ...prev,
        conteudo: newConteudo,
      }));
    },
    [formData.conteudo]
  );

  // Carrega posts do LocalStorage ao iniciar
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedPosts = localStorage.getItem("blogPosts");
      if (savedPosts) {
        setPosts(JSON.parse(savedPosts));
      }
    }
  }, []);

  // Salva posts no LocalStorage quando alterados
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("blogPosts", JSON.stringify(posts));
    }
  }, [posts]);

  // Manipuladores de modo (listar, criar, editar)
  const enterCreateMode = () => {
    setCurrentPost(null);
    setFormData({
      title: "",
      category: "Programação",
      tags: [],
      image: "",
      excerpt: "",
      readingTime: "5 min de leitura",
      conteudo: [],
    });
    setMode("create");
  };

  const enterEditMode = (post: BlogPost) => {
    setCurrentPost(post);
    setFormData({
      title: post.title,
      category: post.category,
      tags: post.tags || [],
      image: post.image || "",
      excerpt: post.excerpt,
      readingTime: post.readingTime || "5 min de leitura",
      conteudo: post.conteudo || [],
    });
    setMode("edit");
  };

  const returnToList = () => {
    setMode("list");
  };

  // Manipuladores do formulário
  const handleInputChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleTagsChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const tags = e.target.value.split(",").map((tag) => tag.trim());
      setFormData((prev) => ({ ...prev, tags }));
    },
    []
  );

  // Manipuladores de conteúdo
  const addContentBlock = useCallback(() => {
    let newContentBlock: ContentBlock;
    switch (currentContentType) {
      case "intro":
        newContentBlock = { tipo: currentContentType, content: currentContent };
        break;
      case "imagem":
        newContentBlock = {
          tipo: currentContentType,
          content: {
            src: currentContent,
            alt: "Imagem do post",
            width: 600,
            height: 300,
            class: "rounded-xl shadow-lg w-full",
          },
        };
        break;
      case "titulo":
        newContentBlock = {
          tipo: currentContentType,
          content: {
            text: currentContent,
            icon: "Tag",
            iconColor: "blue-500",
          },
        };
        break;
      case "codigo":
        newContentBlock = {
          tipo: currentContentType,
          content: {
            title: "Exemplo de Código",
            examples: [
              {
                language: currentContentType,
                color: "text-blue-400",
                code: currentContent,
              },
            ],
          },
        };
        break;
      default:
        newContentBlock = { tipo: currentContentType, content: currentContent };
    }
    setFormData((prev) => ({
      ...prev,
      conteudo: [...prev.conteudo, newContentBlock],
    }));
    setCurrentContent("");
  }, [currentContentType, currentContent]);

  const removeContentBlock = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      conteudo: prev.conteudo.filter((_, i) => i !== index),
    }));
  }, []);

  // Manipuladores de post
  const savePost = useCallback(() => {
    const newPost = {
      id: currentPost?.id || uuidv4(),
      ...formData,
      date: new Date().toLocaleDateString("pt-BR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    };

    if (mode === "create") {
      setPosts((prev) => [newPost, ...prev]);
    } else if (currentPost) {
      setPosts((prev) =>
        prev.map((post) => (post.id === currentPost.id ? newPost : post))
      );
    }

    returnToList();
  }, [currentPost, formData, mode]);

  const deletePost = useCallback((postId: string) => {
    if (confirm("Tem certeza que deseja excluir este post?")) {
      setPosts((prev) => prev.filter((post) => post.id !== postId));
    }
  }, []);

  // Renderização condicional baseada no modo
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-slate-900 dark:text-slate-100 p-6">
      {mode === "list" && (
        <div>
          <h1 className="text-2xl font-bold mb-6 dark:text-white">
            Gerenciamento de Posts
          </h1>
          <button
            onClick={enterCreateMode}
            className="bg-blue-500 text-white px-4 py-2 rounded mb-6 hover:bg-blue-600 transition-colors dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            Criar Novo Post
          </button>
          <PostsTable
            posts={posts}
            enterEditMode={enterEditMode}
            deletePost={deletePost}
          />
        </div>
      )}

      {(mode === "create" || mode === "edit") && (
        <div className="space-y-8">
          <div className="rounded-xl shadow-md p-6 mt-12 border-t pt-8 dark:border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold dark:text-white">
                {mode === "create" ? "Criar Novo Post" : "Editar Post"}
              </h1>
              <button
                onClick={returnToList}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors dark:bg-gray-600 dark:hover:bg-gray-700"
              >
                Voltar para Lista
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Formulário de metadados */}
              <div className="lg:col-span-1 bg-gray-50 p-6 rounded-lg dark:bg-gray-700">
                <h2 className="text-xl font-semibold mb-4 dark:text-white">
                  Metadados do Post
                </h2>
                <PostMetadataForm
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleTagsChange={handleTagsChange}
                />
              </div>

              {/* Editor de conteúdo e lista de blocos */}
              <div className="lg:col-span-2 space-y-6">
                <ContentEditor
                  currentContentType={currentContentType}
                  setCurrentContentType={setCurrentContentType}
                  currentContent={currentContent}
                  setCurrentContent={setCurrentContent}
                  addContentBlock={addContentBlock}
                />
                <ContentBlockList
                  conteudo={formData.conteudo}
                  moveContentBlock={moveContentBlock}
                  setCurrentContentType={setCurrentContentType}
                  setCurrentContent={setCurrentContent}
                  removeContentBlock={removeContentBlock}
                />
                <div className="flex justify-end">
                  <button
                    onClick={savePost}
                    disabled={!formData.title || !formData.excerpt}
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed dark:bg-blue-600 dark:hover:bg-blue-700"
                  >
                    {mode === "create" ? "Publicar Post" : "Atualizar Post"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Seção de Pré-visualização */}
          <PostPreviewWrapper formData={formData} />
        </div>
      )}
    </div>
  );
};

export default BlogAdmin;
