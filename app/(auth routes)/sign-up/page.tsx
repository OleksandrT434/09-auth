'use client';
import css from './SignUpPage.module.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser, type UserRequest } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';


function getErrorMessage(err: unknown): string {
  if (typeof err === 'object' && err !== null) {
    const maybeAxios = err as {
      response?: { data?: { error?: unknown } };
      message?: unknown;
    };
    const apiMessage = maybeAxios.response?.data?.error;
    if (typeof apiMessage === 'string' && apiMessage.trim()) return apiMessage;

    const genericMessage = maybeAxios.message;
    if (typeof genericMessage === 'string' && genericMessage.trim()) return genericMessage;
  }
  return 'Oops... some error';
}

const SignUp = () => {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const setUser = useAuthStore((s) => s.setUser);

  async function handleSubmit(formData: FormData): Promise<void> {
    setError('');
    try {
      const data: UserRequest = {
        email: String(formData.get('email') ?? ''),
        password: String(formData.get('password') ?? ''),
      };

      const res = await registerUser(data);

      if (res) {
        setUser(res);
        router.push('/profile');
      } else {
        setError('Registration failed');
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    }
  }

  
    return (
      <main className={css.mainContent}>
        <h1 className={css.formTitle}>Sign up</h1>
        <form action={handleSubmit} className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" name="email" className={css.input} required />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="password">Password</label>
            <input id="password" type="password" name="password" className={css.input} required />
          </div>

          <div className={css.actions}>
            <button type="submit" className={css.submitButton}>
              Register
            </button>
          </div>
          {error && <p className={css.error}>Error</p>
          }
        </form>
      </main>
    );
  }
export default SignUp;
