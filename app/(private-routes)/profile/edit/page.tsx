'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import css from './EditProfilePage.module.css';
import { useAuthStore } from '@/lib/store/authStore';
import type { User } from '@/types/user';

export default function EditProfilePage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const [error, setError] = useState('');

  if (!user) {
    return <p>Loading...</p>;
  }
  async function handleEdit(formData: FormData) {
  const userName = formData.get('userName') as string;
  if (!user) return;
  const updatedUser: User = {
    ...user,
    userName,
  };
  setUser(updatedUser);
  router.push('/profile');
}


  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={user.photoUrl ?? '/default-avatar.png'}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <form action={handleEdit} className={css.profileInfo}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="userName"
              type="text"
              name="userName"
              defaultValue={user.userName}
              className={css.input}
            />
          </div>

          <p>Email: {user.email}</p>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton}>
              Save
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={() => router.push('/profile')}
            >
              Cancel
            </button>
          </div>
        </form>

        {error && <p className={css.error}>{error}</p>}
      </div>
    </main>
  );
}
