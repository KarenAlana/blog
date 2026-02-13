import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Github, Linkedin, Twitter, MapPin } from "lucide-react";

export default function Component() {
  // Dados para as redes sociais
  const socialLinks = [
    { icon: Github, url: "#" },
    { icon: Linkedin, url: "#" },
    { icon: Twitter, url: "#" },
    { icon: Mail, url: "#" },
  ];

  // Dados para as tecnologias
  const technologies = [
    "Java",
    "Spring Boot",
    "Spring Security",
    "Spring Data JPA",
    "Spring Data MongoDB",
    "Spring Data Redis",
    "React",
    "Angular",
    "Next.js",
    "TypeScript",
    "Node.js",
    "Python",
    "PostgreSQL",
    "AWS",
  ];

  // Dados para os interesses
  const interests = [
    "Engenharia de Software",
    "Web Performance",
    "DevOps",
    "Cloud Computing",
    "Arquitetura de Software",
    "Inteligência Artificial",
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-12 px-4 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Sobre Mim
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Desenvolvedora apaixonada por tecnologia, compartilhando
            conhecimento e experiências através da escrita
          </p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Profile Card */}
          <Card className="md:col-span-1 bg-white dark:bg-slate-800 shadow-lg dark:shadow-slate-700/20">
            <CardContent className="p-6 text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <Image
                  src="/img/img.jpeg"
                  alt="Foto do autor"
                  width={128}
                  height={128}
                  className="rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-lg"
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Karen Alana
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Software Engineer
              </p>
              <div className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                <MapPin className="w-4 h-4 mr-1" />
                Salvador, Brasil
              </div>
              {/* Social Links */}
              <div className="flex justify-center space-x-3">
                {socialLinks.map((social, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="icon"
                    className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 border-gray-300 dark:border-slate-600"
                  >
                    <social.icon className="w-4 h-4" />
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Bio Section */}
          <div className="md:col-span-2 space-y-6">
            <Card className="bg-white dark:bg-slate-800 shadow-lg dark:shadow-slate-700/20">
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Minha História
                </h3>
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    Olá! Sou Karen Alana, sou desenvolvedora Software Engineer,
                    com forte foco em backend utilizando Java e Spring Boot, com
                    experiência no design e entrega de sistemas prontos para
                    produção.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    No frontend, trabalho com React, Next.js e Angular,
                    desenvolvendo interfaces modernas e de fácil manutenção que
                    se integram perfeitamente aos serviços de backend. Também
                    tenho experiência com Node.js, JavaScript e TypeScript, o
                    que me permite contribuir em todo o stack quando necessário.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Possuo experiência prática no design e integração de APIs
                    RESTful, no trabalho com bancos de dados relacionais e não
                    relacionais como PostgreSQL, MySQL e MongoDB, e na
                    implantação de aplicações utilizando serviços da AWS. Sigo
                    boas práticas de engenharia de software, código limpo e
                    testes automatizados para garantir qualidade e
                    confiabilidade do código.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Skills & Interests */}
            <Card className="bg-white dark:bg-slate-800 shadow-lg dark:shadow-slate-700/20">
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Tecnologias & Interesses
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-200 mb-2">
                      Principais Tecnologias:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {technologies.map((tech, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-200 mb-2">
                      Tópicos de Interesse:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {interests.map((interest, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300"
                        >
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
