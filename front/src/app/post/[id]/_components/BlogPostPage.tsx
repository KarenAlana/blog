import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  Clock,
  Tag,
  Share2,
  BookOpen,
  ArrowLeft,
} from "lucide-react";
import Aside from "@/components/common/_Aside";
import { useMemo, useCallback } from "react";

import { useFetchSinglePost } from "@/app/post/_hooks/useFetchSinglePost";

const API_BASE_URL =
  typeof process !== "undefined"
    ? process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
    : "http://localhost:3001";

function getImageSrc(image: string | null | undefined): string {
  if (!image || !image.trim()) return "/placeholder.svg";
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  return image.startsWith("/")
    ? `${API_BASE_URL}${image}`
    : `${API_BASE_URL}/${image}`;
}

// Tipagens
type ImageContent = {
  src: string;
  alt: string;
  width: number;
  height: number;
  class: string;
};

type TituloContent = {
  icon?: string | null;
  iconColor?: string | null;
  text: string;
};

type ComparacaoItem = {
  title: string;
  bg: string;
  border: string;
  items: string[];
};

type EcossistemaItem = {
  title: string;
  description: string;
  bgFrom: string;
  bgTo: string;
  border: string;
  libraries: string[];
};

type CodigoExample = {
  language: string;
  color: string;
  code: string;
};

type CodigoItem = {
  title: string;
  examples: CodigoExample[];
};

type ListaItem = {
  title: string;
  description: string;
  example: string;
};

type PostContentItem =
  | { tipo: "intro"; content: string }
  | { tipo: "conclusao"; content: string }
  | { tipo: "imagem"; content: ImageContent }
  | { tipo: "titulo"; content: TituloContent }
  | { tipo: "comparacao"; content: ComparacaoItem[] }
  | { tipo: "ecossistema"; content: EcossistemaItem[] }
  | { tipo: "codigo"; content: CodigoItem[] }
  | { tipo: "lista"; content: ListaItem[] };

export type PostData = {
  id: string;
  title: string;
  category: string;
  tags: string[];
  image: string;
  date: string;
  readingTime: string;
  excerpt: string;
  conteudo: PostContentItem[];
};

interface BlogPostPageProps {
  id: string;
}

// Componente Header interno
const Header = ({
  backLink = "/",
  title,
  date,
  readingTime,
  category,
  image,
}: {
  backLink: string;
  title: string;
  date: string;
  readingTime: string;
  category: string;
  image: string;
}) => {
  return (
    <header className="relative h-80 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={getImageSrc(image)}
          alt="Hero background"
          className="absolute inset-0 w-full h-full object-cover"
          decoding="async"
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center px-4">
          <Link
            href={backLink}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Blog
          </Link>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {title}
          </h1>
          <div className="flex items-center justify-center gap-6 text-white/90 text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {date}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {readingTime}
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              {category}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

const BlogPostPage: React.FC<BlogPostPageProps> = ({ id }) => {
  const { postData, loading, error } = useFetchSinglePost(id ?? "");

  const conteudo = postData?.conteudo ?? [];
  const tags = postData?.tags ?? [];

  // Memoize renderContent to avoid recalculating on every render (hooks sempre chamados)
  const renderContent = useCallback(() => {
    return conteudo.map((item: PostContentItem, index: number) => {
      switch (item.tipo) {
        case "intro":
        case "conclusao":
          return (
            <div
              key={index}
              className={`${
                item.tipo === "conclusao"
                  ? "mt-12 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-700"
                  : "p-8 border-b border-slate-200 dark:border-slate-700"
              }`}
            >
              {item.tipo === "conclusao" && (
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                  Conclusão
                </h3>
              )}
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.content}
              </p>
            </div>
          );

        case "imagem":
          return (
            <div key={index} className="mb-8">
              <Image
                src={getImageSrc(item.content.src)}
                alt={item.content.alt}
                width={item.content.width}
                height={item.content.height}
                className={item.content.class}
              />
            </div>
          );

        case "titulo":
          return (
            <h2
              key={index}
              className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2"
            >
              {item.content.icon && (
                <Tag className={`w-6 h-6 text-${item.content.iconColor}`} />
              )}
              {item.content.text}
            </h2>
          );

        case "comparacao":
          return (
            <div key={index} className="grid md:grid-cols-2 gap-8 mb-8">
              {item.content.map((comparacao, idx) => (
                <div
                  key={idx}
                  className={`bg-${comparacao.bg} dark:bg-slate-900 rounded-xl p-6 border border-${comparacao.border} dark:border-slate-700`}
                >
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    {comparacao.title}
                  </h3>
                  <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                    {comparacao.items.map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          );

        case "ecossistema":
          return (
            <div key={index} className="grid md:grid-cols-2 gap-8 mb-8">
              {item.content.map((eco, idx) => (
                <div
                  key={idx}
                  className={`bg-gradient-to-br from-${eco.bgFrom} to-${eco.bgTo} dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border border-${eco.border} dark:border-blue-700`}
                >
                  <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">
                    {eco.title}
                  </h3>
                  <p className="text-blue-800 dark:text-blue-200 mb-4">
                    {eco.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {eco.libraries.map((lib) => (
                      <span
                        key={lib}
                        className="px-2 py-1 bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded text-sm"
                      >
                        {lib}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          );

        case "codigo":
          return (
            <div key={index} className="space-y-8">
              {item.content.map((codeBlock, idx) => (
                <div key={idx}>
                  <h3 className="text-xl font-semibold mb-4">
                    {codeBlock.title}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {codeBlock.examples.map((example, i) => (
                      <div
                        key={i}
                        className="bg-slate-900 rounded-lg p-4 overflow-x-auto"
                      >
                        <div className="text-sm text-slate-400 mb-2">
                          {example.language}
                        </div>
                        <pre className={`text-${example.color} text-sm`}>
                          {example.code}
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          );

        case "lista":
          return (
            <div key={index} className="space-y-6">
              {item.content.map((listaItem, idx) => (
                <div key={idx}>
                  <h3 className="text-xl font-semibold mb-2">
                    {listaItem.title}
                  </h3>
                  <p className="text-lg text-slate-600 dark:text-slate-400 mb-2">
                    {listaItem.description}
                  </p>
                  <pre className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 overflow-x-auto text-sm text-slate-900 dark:text-slate-100">
                    {listaItem.example}
                  </pre>
                </div>
              ))}
            </div>
          );

        default:
          return null;
      }
    });
  }, [conteudo]);

  // Memoize tags rendering
  const renderedTags = useMemo(
    () =>
      tags.map((tag: string, index: number) => (
        <span
          key={index}
          className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium"
        >
          {tag}
        </span>
      )),
    [tags],
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">
            Carregando post...
          </p>
        </div>
      </div>
    );
  }

  if (error || !postData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
            Post não encontrado
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {error ||
              "Não foi possível carregar o post. Tente novamente mais tarde."}
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Voltar ao Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-slate-900 dark:text-slate-100">
      {/* Header fixo */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          <article className="flex-grow max-w-4xl">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="p-8 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">{renderedTags}</div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors">
                    <Share2 className="w-4 h-4" />
                    Compartilhar
                  </button>
                </div>
              </div>
              <Header
                backLink="/"
                title={postData.title}
                date={postData.date}
                readingTime={postData.readingTime}
                category={postData.category}
                image={postData.image}
              />
              <div className="p-8 prose prose-slate dark:prose-invert max-w-none">
                {renderContent()}
              </div>
            </div>
          </article>
          <Aside />
        </div>
      </main>
    </div>
  );
};

export default BlogPostPage;
