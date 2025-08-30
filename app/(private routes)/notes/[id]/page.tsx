  import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
  import { fetchGetNoteById } from '@/lib/api/serverApi';
  import NoteDetails from "./NoteDetails.client";
  import { Metadata } from 'next';

  type Props = {
    params: Promise<{ id: string }>;
  };

  export default async function NoteDetailsPage({ params }: Props) {
    const { id } = await params;
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
      queryKey: ['note', id],
      queryFn: () => fetchGetNoteById(id),
    });

    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NoteDetails />
      </HydrationBoundary>
    );
  } 


  export async function generateMetadata({ params }: Props):Promise<Metadata> {
    const { id } = await params;
    const note = await fetchGetNoteById(id);

    return {
      title: note.title,
      description: note.content,
      openGraph: {
        title: note.title,
        description: note.content,
        url: `https://notehub.com/notes/${id}`,
        images: [
          {
            url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
            width: 1200,
            height: 630,
            alt: note.title,
          }
        ]
      },
    }
  }