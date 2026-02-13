"use client";

import BlogPostPage from "./BlogPostPage";

interface PostPageWrapperProps {
  id: string;
}

export default function PostPageWrapper({ id }: PostPageWrapperProps) {
  return <BlogPostPage id={id} />;
}
