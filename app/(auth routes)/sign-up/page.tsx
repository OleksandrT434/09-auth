"use client";

import { FormEvent, useState } from "react";
import css from "./SignUpPage.module.css";
import { SignupRequest, userRegister } from "@/lib/api/clientApi";
import { User } from "@/types/user";
import { useRouter } from "next/navigation";
import { ApiError } from "../sign-in/page";
import { useAuthStore } from "@/lib/store/authStore";

export default function SignUpPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data: SignupRequest = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    try {
      setLoading(true);
      const user: User = await userRegister(data);
      console.log("Registered:", user);
      setUser(user);
      router.push("/profile");
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.response?.data?.error ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={css.mainContent}>
      <h1 className={css.formTitle}>Sign up</h1>
      <form className={css.form} onSubmit={handleSubmit}>
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
            {loading ? "Registering..." : "Register"}
          </button>
        </div>

        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}