"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import css from "./SignInPage.module.css";
import { login } from "@/lib/api/clientApi";
import { LoginRequest, User } from "@/types/user";
import { AxiosError } from "axios";
import { useAuthStore } from "@/lib/store/authStore";

export type ApiError = AxiosError<{ error: string }>;

export default function SignInPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data: LoginRequest = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    try {
      setLoading(true);
      const user: User = await login(data);
      setUser(user);
      router.push("/profile");
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.response?.data?.error ?? "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={css.mainContent}>
      <form className={css.form} onSubmit={handleSubmit}>
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
          <button type="submit" className={css.submitButton} disabled={loading}>
            {loading ? "Logging in..." : "Log in"}
          </button>
        </div>

        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}