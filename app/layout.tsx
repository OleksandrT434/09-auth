import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import { Roboto } from 'next/font/google';
import AuthProvider from "@/components/AuthProvider/AuthProvider";



const roboto = Roboto({
  subsets: ['latin'], 
  weight: ['400', '700'],
  variable: '--font-roboto', 
  display: 'swap', 
});


export const metadata: Metadata = {
  title: "Notes App",
  description: "A convenient application for creating and managing your notes.",
  openGraph: {
    title: "Notes App",
    description: "A convenient application for creating and managing your notes.",
    url: `https://notehub.com/notes/`,
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'NoteHub preview',
      }
    ]
  },
}

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body className={roboto.variable}>
      <div id="modal-root"></div>
        <TanStackProvider>
          <AuthProvider>
          <Header />
          {children}
          {modal}
          <Footer />
          </AuthProvider>
        </TanStackProvider>
        
      </body>
    </html>
  );
}
