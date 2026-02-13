import Image from "next/image";
import Link from "next/link";
import { socialLinks } from "@/lib/data/socialLinks";

const Footer = () => {
  return (
    <footer className="dark:bg-slate-900 not-first-of-type:bg-white dark:text-white text-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo e descrição */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <span className="text-xl font-bold relative h-8 w-32">
                <Image
                  src="/img/logopreto.png"
                  alt="Logo"
                  width={60}
                  height={40}
                  className="object-contain dark:hidden"
                />
                <Image
                  src="/img/logobranco.png" // Adicione uma versão preta da logo
                  alt="Logo"
                  width={60}
                  height={40}
                  className="object-contain hidden dark:block"
                />
              </span>
            </div>
            <p className="dark:text-slate-400  text-slate-600 mb-4 max-w-md">
              Compartilhando conhecimento sobre desenvolvimento web moderno,
              tecnologias emergentes e melhores práticas da indústria.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 dark:bg-slate-800 bg-slate-100 dark:hover:bg-slate-700 hover:bg-slate-200 rounded-lg transition-colors duration-200"
                  aria-label={`Link para ${social.name}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navegação */}
          <div>
            <h4 className="font-semibold mb-4 text-slate-900 dark:text-slate-100 ">Navegação</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="dark:text-slate-400  text-slate-600 dark:hover:text-white hover:text-slate-900 transition-colors duration-200"
                >
                  Início
                </Link>
              </li>
              <li>
                <Link
                  href="/aboutme"
                 className="dark:text-slate-400  text-slate-600 dark:hover:text-white hover:text-slate-900 transition-colors duration-200"
                >
                  Sobre
                </Link>
              </li>
              <li>
                <Link
                  href="/posts/search/all"
                 className="dark:text-slate-400  text-slate-600 dark:hover:text-white hover:text-slate-900 transition-colors duration-200"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Categorias */}
          <div>
            <h4 className="font-semibold mb-4 text-slate-900 dark:text-slate-100">Categorias</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/posts/search/java"
                 className="dark:text-slate-400  text-slate-600 dark:hover:text-white hover:text-slate-900 transition-colors duration-200"
                >
                  Java
                </Link>
              </li>
              <li>
                <Link
                  href="/posts/search/javascript"
                 className="dark:text-slate-400  text-slate-600 dark:hover:text-white hover:text-slate-900 transition-colors duration-200"
                >
                  JavaScript
                </Link>
              </li>
              <li>
                <Link
                  href="/posts/search/angular"
                 className="dark:text-slate-400  text-slate-600 dark:hover:text-white hover:text-slate-900 transition-colors duration-200"
                >
                  Angular
                </Link>
              </li>
              <li>
                <Link
                  href="/posts/search/nextjs"
                 className="dark:text-slate-400  text-slate-600 dark:hover:text-white hover:text-slate-900 transition-colors duration-200"
                >
                  Next.js
                </Link>
              </li>
            
            </ul>
          </div>
        </div>

        {/* Rodapé inferior */}
        <div className="border-t border-slate-800 dark:border-slate-600 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-slate-400 dark:text-slate-600 text-sm">
            © {new Date().getFullYear()} DevBlog. Todos os direitos reservados.
          </p>
          <p className="text-slate-400 dark:text-slate-600 text-sm mt-2 md:mt-0">
            Feito com ❤️ e muito café
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;