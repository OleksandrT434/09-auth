'use client';

import css from './SignInPage.module.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import { UserRequest } from '@/types/user';

export default function SignIn() {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const setUser = useAuthStore((s) => s.setUser);

  const handleSubmit = async (formData: FormData) => {
    try {
      const newUser = Object.fromEntries(formData) as UserRequest;
      const user = await login(newUser);
      setUser(user);
      router.push('/profile');
    } catch (error) {
      setError(
        typeof error === 'object' && error !== null && 'message' in error
          ? ((error as { message?: string }).message ?? 'Oops... some error')
          : 'Oops... some error'
      );
    }
  };

  return (
    <main className={css.mainContent}>
      <form action={handleSubmit} className={css.form}>
        <h1 className={css.formTitle}>Sign in</h1>

        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            required
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            required
          />
        </div>

        <div className={css.actions}>
          <button type="submit" className={css.submitButton}>
            Log in
          </button>
        </div>

        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}
