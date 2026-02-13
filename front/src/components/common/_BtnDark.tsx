"use client";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const BtnDark = () => {
  const [darkMode, setDarkMode] = useState<boolean | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    // Se tem tema salvo, usa ele
    if (savedTheme) {
      setDarkMode(savedTheme === "dark");
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
    // Se não tem tema salvo, define como dark (padrão)
    else {
      setDarkMode(true); // Tema dark por padrão
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  }, []);

  useEffect(() => {
    if (darkMode !== null) {
      if (darkMode) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    }
  }, [darkMode]);

  if (darkMode === null) {
    return null; // Não renderiza até definir o tema
  }

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="px-4 py-2 rounded transition duration-300 cursor-pointer"
    >
      {darkMode ? (
        <Sun className="w-5 h-5 text-gray-100" />
      ) : (
        <Moon className="w-5 h-5 text-gray-800" />
      )}
    </button>
  );
};

export default BtnDark;
