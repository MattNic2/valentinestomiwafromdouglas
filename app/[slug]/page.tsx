export async function generateMetadata({ params }): Promise<Metadata> {
  return {
    title: `Page ${params.slug}`,
    twitter: {
      card: "summary_large_image",
      title: `Page ${params.slug}`,
      images: [`${process.env.NEXT_PUBLIC_BASE_URL}/${params.slug}.jpg`],
    },
  };
}
