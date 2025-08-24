import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile - NoteHub',
  description: 'Manage your profile on NoteHub',
  openGraph: {
    title: 'Profile - NoteHub',
    description: 'Manage your profile on NoteHub',
    url: 'https://notehub.com/profile',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'NoteHub Profile Page',
      },
    ],
  },
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
