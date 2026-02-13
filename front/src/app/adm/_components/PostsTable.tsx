import React from "react";

type ContentBlock =
  | {
      tipo: "imagem";
      content: {
        src: string;
        alt: string;
        width?: number;
        height?: number;
        class?: string;
      };
    }
  | {
      tipo: "titulo";
      content: { text: string; icon?: string; iconColor?: string };
    }
  | {
      tipo: "codigo";
      content: {
        title?: string;
        examples: Array<{ language: string; color?: string; code: string }>;
      };
    }
  | { tipo: string; content: string };

interface PostsTableProps {
  posts: Array<{
    id: string;
    title: string;
    category: string;
    date: string;
    tags: string[];
    image: string;
    excerpt: string;
    readingTime: string;
    conteudo: ContentBlock[];
  }>;
  enterEditMode: (post: {
    id: string;
    title: string;
    category: string;
    date: string;
    tags: string[];
    image: string;
    excerpt: string;
    readingTime: string;
    conteudo: ContentBlock[];
  }) => void;
  deletePost: (postId: string) => void;
}

const PostsTable: React.FC<PostsTableProps> = ({
  posts,
  enterEditMode,
  deletePost,
}) => (
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white rounded-lg overflow-hidden dark:bg-gray-800">
      <thead className="bg-gray-100 dark:bg-gray-700">
        <tr>
          <th className="py-3 px-4 text-left dark:text-gray-200">Título</th>
          <th className="py-3 px-4 text-left dark:text-gray-200">Categoria</th>
          <th className="py-3 px-4 text-left dark:text-gray-200">Data</th>
          <th className="py-3 px-4 text-left dark:text-gray-200">Ações</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
        {posts.map((post) => (
          <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
            <td className="py-3 px-4 dark:text-gray-300">{post.title}</td>
            <td className="py-3 px-4 dark:text-gray-300">{post.category}</td>
            <td className="py-3 px-4 dark:text-gray-300">{post.date}</td>
            <td className="py-3 px-4 space-x-2">
              <button
                onClick={() => enterEditMode(post)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition-colors dark:bg-yellow-600 dark:hover:bg-yellow-700"
              >
                Editar
              </button>
              <button
                onClick={() => deletePost(post.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors dark:bg-red-600 dark:hover:bg-red-700"
              >
                Excluir
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default PostsTable;
