'use client';

import css from './SignInPage.module.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login, type LoginRequest } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';

export default function SignIn() {
  const router = useRouter();
  const [error, setError] = useState('');
  const setUser = useAuthStore((s) => s.setUser);

  async function handleSubmit(formData: FormData) {
    setError('');
    try {
      const formValues = Object.fromEntries(formData) as LoginRequest;
      const user = await login(formValues); 
      setUser(user);               
      router.push('/profile');             
    } catch (e: any) {
      setError(
        e?.response?.data?.error ??
        e?.message ??
        'Error'
      );
    }
  }

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
