export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPost(params.id);

  return {
    title: post.title,
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | My Blog`,
      description: post.excerpt,
      images: [post.coverImage],
    },
  };
}
