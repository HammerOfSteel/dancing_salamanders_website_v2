import { getNovelBySlug } from "@/lib/novels";
import { renderPreviewCard } from "@/lib/og-image";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const novel = getNovelBySlug(slug);
  return renderPreviewCard({
    topText: novel?.meta.title ?? "Dancing Salamanders",
    coverPath: novel?.meta.coverImage,
  });
}
