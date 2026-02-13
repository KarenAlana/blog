import React from "react";

interface PostMetadataFormProps {
  formData: {
    title: string;
    category: string;
    tags: string[];
    image: string;
    readingTime: string;
    excerpt: string;
  };
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  handleTagsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PostMetadataForm: React.FC<PostMetadataFormProps> = ({
  formData,
  handleInputChange,
  handleTagsChange,
}) => (
  <div className="space-y-5">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
        Título*
      </label>
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleInputChange}
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400"
        required
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
        Categoria
      </label>
      <select
        name="category"
        value={formData.category}
        onChange={handleInputChange}
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400"
      >
        <option value="Programação">Programação</option>
        <option value="Tecnologia">Tecnologia</option>
        <option value="Design">Design</option>
        <option value="Negócios">Negócios</option>
      </select>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
        Tags (separadas por vírgula)
      </label>
      <input
        type="text"
        value={formData.tags.join(", ")}
        onChange={handleTagsChange}
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400"
        placeholder="React, JavaScript, Next.js"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
        URL da Imagem
      </label>
      <input
        type="text"
        name="image"
        value={formData.image}
        onChange={handleInputChange}
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400"
        placeholder="https://exemplo.com/imagem.jpg"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
        Tempo de Leitura
      </label>
      <input
        type="text"
        name="readingTime"
        value={formData.readingTime}
        onChange={handleInputChange}
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
        Resumo*
      </label>
      <textarea
        name="excerpt"
        value={formData.excerpt}
        onChange={handleInputChange}
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400"
        rows={3}
        required
      />
    </div>
  </div>
);

export default PostMetadataForm;
