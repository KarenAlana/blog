import React from "react";
import Preview from "../preview/Preview";

type ContentBlock =
  | {
      tipo: "imagem";
      content: {
        src: string;
        alt: string;
        width?: number;
        height?: number;
        class?: string;
      };
    }
  | {
      tipo: "titulo";
      content: { text: string; icon?: string; iconColor?: string };
    }
  | {
      tipo: "codigo";
      content: {
        title?: string;
        examples: Array<{ language: string; color?: string; code: string }>;
      };
    }
  | { tipo: string; content: string };

type PreviewData = {
  title: string;
  category: string;
  tags: string[];
  image: string;
  date: string;
  readingTime: string;
  conteudo: ContentBlock[];
};

const PostPreviewWrapper = ({
  formData,
}: {
  formData: {
    title: string;
    category: string;
    tags: string[];
    image: string;
    readingTime: string;
    conteudo: ContentBlock[];
  };
}) => {
  const previewData: PreviewData = {
    title: formData.title || "Título do Post (Pré-visualização)",
    category: formData.category || "Programação",
    tags: formData.tags.length ? formData.tags : ["exemplo"],
    image: formData.image || "https://placehold.co/800x400?text=Imagem+do+Post",
    date: new Date().toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    readingTime: formData.readingTime || "5 min de leitura",
    conteudo: formData.conteudo.length
      ? formData.conteudo
      : [
          {
            tipo: "intro" as const,
            content:
              "Este é um exemplo de conteúdo. Preencha o formulário para ver a pré-visualização atualizar.",
          },
        ],
  };

  return (
    <div className="mt-12 border-t pt-8 dark:border-gray-700">
      <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 dark:text-white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
        </svg>
        Pré-visualização do Post
      </h3>
      <div className="scale-[0.85] origin-top -mx-16 border rounded-lg overflow-hidden shadow-lg dark:border-gray-700">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <Preview postData={previewData as any} />
      </div>
    </div>
  );
};

export default PostPreviewWrapper;
