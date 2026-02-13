import { Github, Instagram, Linkedin, Youtube } from "lucide-react";

export const socialLinks = [
  {
    name: "Instagram",
    url: "#",
    icon: <Instagram className="w-5 h-5" />,
    color: "hover:text-pink-500",
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/karen-alana",
    icon: <Linkedin className="w-5 h-5" />,
    color: "hover:text-blue-600",
  },
  {
    name: "GitHub",
    url: "https://github.com/KarenAlana",
    icon: <Github className="w-5 h-5" />,
    color: "hover:text-gray-800 dark:hover:text-gray-200",
  },
  {
    name: "YouTube",
    url: "https://www.youtube.com/@KarenAlana",
    icon: <Youtube className="w-5 h-5" />,
    color: "hover:text-red-500",
  },
];
