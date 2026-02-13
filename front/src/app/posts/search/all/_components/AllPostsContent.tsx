"use client";

import { Calendar, ArrowRight, Loader } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useFetchPosts } from "../../../_hooks/useFetchPosts";

const getCategoryColor = (category: string) => {
  const colors: { [key: string]: { light: string; dark: string } } = {
    Programação: {
      light: "bg-blue-100 text-blue-800 hover:bg-blue-200",
      dark: "bg-blue-900/50 text-blue-200 hover:bg-blue-800/70",
    },
    Tecnologia: {
      light: "bg-green-100 text-green-800 hover:bg-green-200",
      dark: "bg-green-900/50 text-green-200 hover:bg-green-800/70",
    },
    Design: {
      light: "bg-purple-100 text-purple-800 hover:bg-purple-200",
      dark: "bg-purple-900/50 text-purple-200 hover:bg-purple-800/70",
    },
    Negócios: {
      light: "bg-orange-100 text-orange-800 hover:bg-orange-200",
      dark: "bg-orange-900/50 text-orange-200 hover:bg-orange-800/70",
    },
  };

  return (
    colors[category] || {
      light: "bg-gray-100 text-gray-800 hover:bg-gray-200",
      dark: "bg-gray-800/50 text-gray-200 hover:bg-gray-700/70",
    }
  );
};

export default function AllPostsContent() {
  const { posts, loading, error } = useFetchPosts();

  if (loading) {
    return (
      <div className="min-h-screen py-12 px-4 bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 mx-auto mb-4 animate-spin text-blue-600 dark:text-blue-400" />
          <p className="text-slate-600 dark:text-slate-400">
            Carregando posts...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-12 px-4 bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
            Erro ao carregar posts
          </h2>
          <p className="text-red-600 dark:text-red-400 mb-6">{error}</p>
          <a
            href="/"
            className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Voltar ao Blog
          </a>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="min-h-screen py-12 px-4 bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
            Nenhum post disponível
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Volte mais tarde para novos conteúdos
          </p>
          <a
            href="/"
            className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Voltar
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent mb-4">
            Veja todos os posts
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Descubra artigos incríveis sobre desenvolvimento, tecnologia e muito
            mais
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => {
            const categoryColors = getCategoryColor(post.category);

            return (
              <Link key={post.id} href={`/post/${post.id}`} className="group">
                <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700">
                  <div className="relative overflow-hidden">
                    <img
                      src={post.image ?? "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <div className="bg-white/90 dark:bg-slate-700/90 backdrop-blur-sm rounded-full p-2">
                        <ArrowRight className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <Badge
                        variant="secondary"
                        className={`${categoryColors.light} dark:${categoryColors.dark} transition-colors duration-200 font-medium`}
                      >
                        {post.category}
                      </Badge>
                      <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm">
                        <Calendar className="w-4 h-4 mr-1" />
                        {post.date}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-slate-600 dark:text-slate-400 mb-3 text-sm line-clamp-2">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      Ler mais
                      <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-16">
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 hover:from-blue-700 hover:to-purple-700 dark:hover:from-blue-600 dark:hover:to-purple-600 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl active:scale-95">
            Carregar mais posts
          </button>
        </div>
      </div>
    </div>
  );
}
