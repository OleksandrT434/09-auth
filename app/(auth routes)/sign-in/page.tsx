'use client';

import css from './SignInPage.module.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser, type UserRequest } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';

function getErrorMessage(err: unknown): string {
  if (typeof err === 'object' && err !== null) {
    const mAxios = err as {
      response?: { data?: { error?: unknown } };
      message?: unknown;
    };

    const apiMessage = mAxios.response?.data?.error;
    if (typeof apiMessage === 'string' && apiMessage.trim()) return apiMessage;

    const genericMessage = mAxios.message;
    if (typeof genericMessage === 'string' && genericMessage.trim()) return genericMessage;
  }
  return 'Error';
}

export default function SignIn() {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const setUser = useAuthStore((s) => s.setUser);

  async function handleSubmit(formData: FormData): Promise<void> {
    setError('');
    try {
      const formValues = Object.fromEntries(formData) as UserRequest;
      const user = await loginUser(formValues);
      setUser(user);
      router.push('/profile');
    } catch (err: unknown) {
      setError(getErrorMessage(err));
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
