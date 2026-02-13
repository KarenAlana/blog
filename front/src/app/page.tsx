import Link from "next/link";
import Image from "next/image";
import { Calendar, Star } from "lucide-react";
import Aside from "@/components/common/_Aside";

const HomePage = () => {
  const featuredPosts = [
    {
      id: "5e878295-f3c7-48fd-b2f4-3e1c4bef2bd7",
      title: "Python vs JavaScript",
      image: "/img/img11.png",
      excerpt:
        "Uma comparação detalhada entre duas das linguagens mais populares do desenvolvimento.",
      readTime: "5 min",
    },
    {
      id: "3f2bb109-9bff-4a9b-b77e-2c6e654d5870",
      title: "MERN sabe o que é?",
      image: "/img/img14.png",
      excerpt:
        "Descubra o stack MERN e como ele pode revolucionar seu desenvolvimento.",
      readTime: "3 min",
    },
    {
      id: "3525e246b-b194-4ac5-8233-4daa74758d12",
      title: "Responsividade, sabe o que é?",
      image: "/img/img01.png",
      excerpt: "Aprenda os fundamentos do design responsivo moderno.",
      readTime: "4 min",
    },
  ];

  const recentPosts = [
    {
      id: "d76567a3-aff2-4b92-b89c-c9001b6b9ce7",
      title: "Framework x Biblioteca. Qual a diferença?",
      category: "Framework",
      date: "10 de Junho, 2024",
      image: "/img/img15.png",
      excerpt:
        "Entenda as principais diferenças entre frameworks e bibliotecas no desenvolvimento.",
      readTime: "6 min",
    },
    {
      id: "3f2bb109-9bff-4a9b-b77e-2c6e654d5870",
      title: "React Hooks: Guia Completo",
      category: "React",
      date: "8 de Junho, 2024",
      image: "/img/img14.png",
      excerpt: "Domine os React Hooks com exemplos práticos e casos de uso.",
      readTime: "8 min",
    },
    {
      id: "6b0f86cb0-6f6a-4379-987b-077767546297",
      title: "CSS Grid vs Flexbox",
      category: "CSS",
      date: "5 de Junho, 2024",
      image: "/img/img12.png",
      excerpt: "Quando usar CSS Grid e quando usar Flexbox em seus projetos.",
      readTime: "5 min",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-slate-900 dark:text-slate-100">
      {/* Enhanced Navbar */}

      {/* Enhanced Hero Section */}
      <header className="relative h-[500px] overflow-hidden">
        {/* Container para a imagem com overlay */}
        <div className="absolute inset-0">
          <Image
            src="/img/imgteste.png"
            alt="Hero background"
            fill
            className="object-cover"
          />
          {/* Overlay escuro */}
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        {/* Gradiente colorido */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90 mix-blend-overlay"></div>

        {/* Conteúdo */}
        <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Desenvolvimento
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Moderno
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              Artigos, tutoriais e insights sobre as tecnologias mais atuais do
              desenvolvimento web
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/posts/search/all"
                className="m-2 px-8 py-4 bg-white text-slate-900 rounded-xl font-semibold hover:bg-slate-100 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Explorar Artigos
              </Link>
              <Link
                href="/aboutme"
                className=" m-2 px-8 py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-slate-900 transition-all duration-300"
              >
                Sobre o Autor
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-grow">
            {/* Featured Posts Section */}
            <section className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                  Artigos em Destaque
                </h2>
                <Star className="w-6 h-6 text-yellow-500" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <Link
                    href={`/post/${featuredPosts[0].id}`}
                    className="block group"
                  >
                    <div className="relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:scale-[1.02]">
                      <Image
                        src={featuredPosts[0].image || "/placeholder.svg"}
                        alt={featuredPosts[0].title}
                        width={600}
                        height={400}
                        className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-8">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-3 py-1 bg-blue-500 text-white text-sm font-medium rounded-full">
                            Destaque
                          </span>
                          <span className="text-white/80 text-sm">
                            {featuredPosts[0].readTime} de leitura
                          </span>
                        </div>
                        <h3 className="text-white text-2xl font-bold mb-2 group-hover:text-blue-300 transition-colors">
                          {featuredPosts[0].title}
                        </h3>
                        <p className="text-white/90 text-sm leading-relaxed">
                          {featuredPosts[0].excerpt}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>

                <div className="flex flex-col gap-6">
                  {featuredPosts.slice(1).map((post) => (
                    <Link
                      key={post.id}
                      href={`/post/${post.id}`}
                      className="block group flex-1"
                    >
                      <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 h-full">
                        <Image
                          src={post.image || "/placeholder.svg"}
                          alt={post.title}
                          width={400}
                          height={300}
                          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-white/80 text-xs">
                              {post.readTime}
                            </span>
                          </div>
                          <h4 className="text-white font-bold text-sm group-hover:text-blue-300 transition-colors">
                            {post.title}
                          </h4>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>

            {/* Recent Posts Section */}
            <section>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
                Últimos Artigos
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {recentPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/post/${post.id}`}
                    className="block group"
                  >
                    <article className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 border border-slate-200 dark:border-slate-700">
                      <div className="relative overflow-hidden">
                        <Image
                          src={post.image || "/placeholder.svg"}
                          alt={post.title}
                          width={300}
                          height={200}
                          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
                            {post.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="font-bold text-lg mb-3 text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {post.date}
                          </div>
                          <span>{post.readTime} de leitura</span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </section>
          </div>
          <Aside />
        </div>
      </main>
    </div>
  );
};

export default HomePage;
