import React from "react";

interface ContentEditorProps {
  currentContentType: string;
  setCurrentContentType: (type: string) => void;
  currentContent: string;
  setCurrentContent: (content: string) => void;
  addContentBlock: () => void;
}

const ContentEditor: React.FC<ContentEditorProps> = ({
  currentContentType,
  setCurrentContentType,
  currentContent,
  setCurrentContent,
  addContentBlock,
}) => (
  <div className="bg-gray-50 p-6 rounded-lg dark:bg-gray-700">
    <h2 className="text-xl font-semibold mb-4 dark:text-white">
      Adicionar Conteúdo
    </h2>
    <div className="flex flex-col sm:flex-row gap-4 mb-4">
      <select
        value={currentContentType}
        onChange={(e) => setCurrentContentType(e.target.value)}
        className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400"
      >
        <option value="intro">Introdução</option>
        <option value="imagem">Imagem</option>
        <option value="titulo">Título</option>
        <option value="codigo">Código</option>
        <option value="conclusao">Conclusão</option>
      </select>
      {currentContentType === "imagem" ? (
        <input
          type="text"
          value={currentContent}
          onChange={(e) => setCurrentContent(e.target.value)}
          placeholder="URL da imagem"
          className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400"
        />
      ) : (
        <textarea
          value={currentContent}
          onChange={(e) => setCurrentContent(e.target.value)}
          placeholder={`Digite o conteúdo para ${currentContentType}`}
          className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400"
          rows={3}
        />
      )}
      <button
        onClick={addContentBlock}
        disabled={!currentContent.trim()}
        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed dark:bg-green-600 dark:hover:bg-green-700"
      >
        Adicionar
      </button>
    </div>
  </div>
);

export default ContentEditor;
