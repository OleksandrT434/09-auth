import Image from 'next/image';
import Link from 'next/link';
import css from './ProfilePage.module.css';
import {getCurrentUserServer}  from "@/lib/api/serverApi"
import { Metadata } from 'next';

const PageProfile = async () => {
  const user = await getCurrentUserServer();

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
            src={user.avatar ?? "/default-avatar.png"}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>

        <div className={css.profileInfo}>
          <p>Username: {user?.username}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  );
};

export default PageProfile;


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
                }
            ]
        },
    }
 