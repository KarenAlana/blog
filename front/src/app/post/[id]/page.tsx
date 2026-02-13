import PostPageWrapper from "./_components/PostPageWrapper";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PostPageWrapper id={id} />;
}
