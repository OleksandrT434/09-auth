import css from "./ProfilePage.module.css";
import Image from "next/image";
import type { Metadata } from "next";
import { getServerMe } from "@/lib/api/serverApi";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Profile Page | NoteHub",
  description: "Welcome to your profile.",

  openGraph: {
    title: "Profile Page | NoteHub",
    description: "Welcome to your profile.",
    url: "https://09-auth-nu-three.vercel.app/",
    siteName: "My NoteHub App",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 700,
        height: 700,
        alt: "Your avatar",
      },
    ],
  },
};
export const dynamic = "force-dynamic";

export default async function Profile() {
  const user = await getServerMe();
  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>
        <div className={css.avatarWrapper}>
          <Image
            src={
              user.avatar && user.avatar.trim() !== ""
                ? user.avatar
                : "/default-avatar.png"
            }
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>
        <div className={css.profileInfo}>
          <p>Username: {user.username ?? user.email.split("@")[0]}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  );
}