"use client";
import { useState } from "react";
import { Search } from "lucide-react";

const SearchBtn = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const pesquisar = () => {
    window.location.href = `/posts/search${searchTerm ? `/${searchTerm}` : ""}`;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      pesquisar();
    }
  };

  return (
    <div className="hidden lg:flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-2 border border-slate-200 dark:border-slate-700 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
      <Search className="w-4 h-4 text-slate-500 mr-3" />
      <input
        type="text"
        placeholder="Buscar artigos..."
        className="bg-transparent border-none outline-none w-48 text-sm placeholder-slate-500"
        value={searchTerm}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default SearchBtn;