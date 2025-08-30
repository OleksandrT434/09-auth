"use client";

import { ReactNode, useEffect } from "react";
import { checkSession, getMe, logout } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import { User } from "@/types/user";

type Props = {
  children: ReactNode;
};

const AuthProvider = ({ children }: Props) => {
  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated
  );

  useEffect(() => {
    const fetchUser = async () => {
      const active = await checkSession();

      if (active) {
        try {
          const user: User = await getMe();
          if (user) setUser(user);
        } catch (err) {
          console.error("Failed to fetch user", err);
          clearIsAuthenticated();
          await logout();
        }
      } else {
        clearIsAuthenticated();
      }
    };

    fetchUser();
  }, [setUser, clearIsAuthenticated]);

  return <>{children}</>;
};

export default AuthProvider;