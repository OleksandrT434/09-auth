import AppPage from "./Notes.client";
import { Metadata } from "next";

type Params = { slug: string[] };
type Props = { params: Promise<Params> };

const NotesByFilter = async ({ params }: Props) => {
  const { slug } = await params;
  const tag = slug?.[0] ?? "All";

  return (
    <div>
      <AppPage tag={tag} />
    </div>
  );
};

export default NotesByFilter;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug?.[0] ?? "All";

  return {
    title: `Notes with ${tag}`,
    description: `Explore notes with ${tag}.`,
    openGraph: {
      title: `Notes with ${tag}`,
      description: `Explore notes with ${tag}.`,
      url: `https://notehub.com/notes/filter/${slug?.join("/") ?? ""}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "NoteHub preview",
        },
      ],
    },
  };
}
