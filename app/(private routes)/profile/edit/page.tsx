"use client";

import css from "./EditProfilePage.module.css";

import { getMe, updateMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";

export default function EditProfilePage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatarSrc, setAvatarSrc] = useState("/default-avatar.png");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    let active = true;

    async function fetchProfile() {
      try {
        const user = await getMe();
        if (!active) return;

        setUsername(user.username ?? "");
        setEmail(user.email);
        if (user.avatar) {
          setAvatarSrc(user.avatar);
        }
      } catch (err) {
        console.error("Error loading profile", err);
      } finally {
        if (active) setIsLoading(false);
      }
    }

    fetchProfile();
    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const updatedUser: User = await updateMe({ username, email });
      setUser(updatedUser);
      router.push("/profile");
    } catch (err) {
      console.error("Failed to save changes", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push("/profile");
  };

  if (isLoading) {
    return <div className={css.loading}>Loading…</div>;
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={avatarSrc}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <form onSubmit={handleSubmit} className={css.profileInfo}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              className={css.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <p>Email: {email}</p>
          <div className={css.actions}>
            <button
              type="submit"
              className={css.saveButton}
              disabled={isSaving}
            >
              Save
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={handleCancel}
              disabled={isSaving}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}