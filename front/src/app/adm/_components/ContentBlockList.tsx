import React from "react";
import Image from "next/image";

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

interface ContentBlockListProps {
  conteudo: ContentBlock[];
  moveContentBlock: (index: number, direction: "up" | "down") => void;
  setCurrentContentType: (type: string) => void;
  setCurrentContent: (content: string) => void;
  removeContentBlock: (index: number) => void;
}

const ContentBlockList: React.FC<ContentBlockListProps> = ({
  conteudo,
  moveContentBlock,
  setCurrentContentType,
  setCurrentContent,
  removeContentBlock,
}) => (
  <div className="bg-gray-50 p-6 rounded-lg dark:bg-gray-700">
    <h2 className="text-xl font-semibold mb-4 dark:text-white">
      Conteúdo do Post
    </h2>
    {conteudo.length === 0 ? (
      <p className="text-gray-500 italic dark:text-gray-400">
        Nenhum bloco de conteúdo adicionado ainda.
      </p>
    ) : (
      <div className="space-y-4">
        {conteudo.map((block, index) => (
          <div
            key={index}
            className="border border-gray-200 p-4 rounded-lg bg-white relative group dark:border-gray-600 dark:bg-gray-600"
          >
            <div className="absolute -top-2 -right-2 flex gap-1">
              {/* Botões de mover */}
              <div className="flex flex-col gap-1 mr-2">
                <button
                  onClick={() => moveContentBlock(index, "up")}
                  disabled={index === 0}
                  className={`bg-gray-200 text-gray-700 rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-gray-300 dark:bg-gray-500 dark:text-gray-200 dark:hover:bg-gray-400 ${
                    index === 0 ? "opacity-30 cursor-not-allowed" : ""
                  }`}
                  title="Mover para cima"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="18 15 12 9 6 15"></polyline>
                  </svg>
                </button>
                <button
                  onClick={() => moveContentBlock(index, "down")}
                  disabled={index === conteudo.length - 1}
                  className={`bg-gray-200 text-gray-700 rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-gray-300 dark:bg-gray-500 dark:text-gray-200 dark:hover:bg-gray-400 ${
                    index === conteudo.length - 1
                      ? "opacity-30 cursor-not-allowed"
                      : ""
                  }`}
                  title="Mover para baixo"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
              </div>
              {/* Botão de editar */}
              <button
                onClick={() => {
                  setCurrentContentType(block.tipo);
                  if (block.tipo === "imagem") {
                    setCurrentContent((block.content as ImageContent).src);
                  } else if (block.tipo === "titulo") {
                    setCurrentContent((block.content as TitleContent).text);
                  } else if (block.tipo === "codigo") {
                    setCurrentContent(
                      (block.content as CodeContent).examples[0].code
                    );
                  } else {
                    setCurrentContent(block.content as string);
                  }
                  removeContentBlock(index);
                }}
                className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700"
                title="Editar bloco"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
              {/* Botão de remover */}
              <button
                onClick={() => removeContentBlock(index)}
                className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                title="Remover bloco"
              >
                ×
              </button>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded-full capitalize dark:bg-blue-200 dark:text-blue-900">
                {block.tipo}
              </span>
            </div>
            {block.tipo === "imagem" ? (
              <div>
                <p className="text-sm text-gray-600 mb-1 dark:text-gray-300">
                  Imagem: {(block.content as ImageContent).src}
                </p>
                <div className="bg-gray-100 p-2 rounded dark:bg-gray-500">
                  <Image
                    src={(block.content as ImageContent).src}
                    alt={(block.content as ImageContent).alt}
                    width={(block.content as ImageContent).width || 600}
                    height={(block.content as ImageContent).height || 300}
                    className={
                      (block.content as ImageContent).class ||
                      "max-w-full h-auto rounded"
                    }
                  />
                </div>
              </div>
            ) : block.tipo === "codigo" ? (
              <div className="bg-gray-800 text-gray-100 p-3 rounded overflow-x-auto">
                <pre className="text-sm">
                  {(block.content as CodeContent).examples[0].code}
                </pre>
              </div>
            ) : block.tipo === "titulo" ? (
              <p className="text-gray-700 whitespace-pre-wrap dark:text-gray-300">
                {(block.content as TitleContent).text}
              </p>
            ) : (
              <p className="text-gray-700 whitespace-pre-wrap dark:text-gray-300">
                {block.content as string}
              </p>
            )}
          </div>
        ))}
      </div>
    )}
  </div>
);

export default ContentBlockList;
