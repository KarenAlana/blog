import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { socialLinks } from "@/lib/data/socialLinks";
import SearchBtn from "./_SearchBtn";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { ThemeToggle } from "../ui/theme-toggle";

const Nav = () => {
  return (
    <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center justify-center">
            <div className="flex items-center">
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
          </Link>

          {/* Menu Desktop */}
          <ul className="hidden md:flex items-center space-x-8">
            <NavLink href="/">Início</NavLink>
            <NavLink href="/aboutme">Sobre</NavLink>
            <NavLink href="/posts/search/all">Blog</NavLink>
            <NavLink href="/adm">Add Article</NavLink>
            <li>
              <ul className="flex items-center space-x-3">
                {socialLinks.map((social) => (
                  <li key={social.name}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-slate-600 dark:text-slate-400 hover:text-pink-600 dark:hover:text-pink-400  transition-all duration-200"
                    >
                      {social.icon}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          </ul>

          {/* Botões Extras */}
          <div className="flex items-center gap-2">
            <SearchBtn />
            <ThemeToggle />

            {/* Menu Mobile */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden h-9 w-9 p-0 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-full max-w-[320px] sm:max-w-[380px] bg-white/95 dark:bg-slate-900/95"
              >
                <div className="relative h-full flex flex-col">
                  {/* Header */}
                  <SheetHeader className="border-b border-slate-200 dark:border-slate-800 pb-4">
                    <div className="flex items-center justify-between">
                      <SheetTitle className="text-left text-lg font-semibold">
                        Menu
                      </SheetTitle>
                      <SheetClose asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 p-0"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </SheetClose>
                    </div>
                  </SheetHeader>

                  {/* Conteúdo */}
                  <div className="flex-1 py-6 space-y-6">
                    <nav className="grid gap-2">
                      <MobileNavLink href="/">Início</MobileNavLink>
                      <MobileNavLink href="/aboutme">Sobre</MobileNavLink>
                      <MobileNavLink href="/posts/search/all">
                        Blog
                      </MobileNavLink>
                      <MobileNavLink href="/adm">Add Cont</MobileNavLink>
                    </nav>

                    {/* Socials */}
                    <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                      <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4 ml-2.5">
                        Redes Sociais
                      </h3>
                      <div className="flex gap-3">
                        {socialLinks.map((social) => (
                          <a
                            key={social.name}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-slate-600 dark:text-slate-400 hover:text-pink-600 dark:hover:text-pink-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-200"
                          >
                            {social.icon}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-800">
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      © {new Date().getFullYear()} Seu Site
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <li>
    <Link
      href={href}
      className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
    >
      {children}
    </Link>
  </li>
);

const MobileNavLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <SheetClose asChild>
    <Link
      href={href}
      className="flex items-center py-3 px-4 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium"
    >
      {children}
    </Link>
  </SheetClose>
);

export default Nav;
