'use client';

import css from "./EditProfilePage.module.css"
import { useAuthStore } from '@/lib/store/authStore';
import Image from 'next/image';
import { updateUser } from '@/lib/api/clientApi';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {User} from '@/types/user'

export default function EditProfilePage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const [error, setError] = useState('');

  if (!user) return <p>Loading...</p>;

  async function handleEdit(formData: FormData) {
    setError('');
    try {

      const username = String(formData.get('username') ?? '').trim();
      if (!username || username === user?.username) {
        router.push('/profile');
        return;
      }
      const updated: User = await updateUser({ username }); 
      setUser(updated);
      router.replace('/profile');
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to update profile');
      }
    }
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
             <label htmlFor="username">Username: {user?.username}</label>
            <input
              id="username"
              name="username"  
              type="text"
              defaultValue={user.username} 
              className={css.input}
            />
          </div>

          <p>Email: {user.email}</p>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton}>Save</button>
            <button type="button" className={css.cancelButton} onClick={() => router.push('/profile')}>
              Cancel
            </button>
          </div>
        </form>

        {error && <p className={css.error}>{error}</p>}
      </div>
    </main>
  );
}