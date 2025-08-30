'use client';

import { useEffect, useState } from 'react';
import { checkSessionClient, getUserInfo } from '@/lib/api/clientApi'
import { useAuthStore } from '@/lib/store/authStore';


export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const setAuth = useAuthStore((s) => s.setUser);
  const clearAuth = useAuthStore((s) => s.clearIsAuthenticated);
  const [loading, setLoading] = useState(true);

useEffect(() => {
    async function loadUser() {
      try {
        const session = await checkSessionClient();
        if (session.authenticated) {
           const user = await getUserInfo()
          setAuth(user);
        } else {
          clearAuth();
        }
      } catch {
        clearAuth();
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [setAuth, clearAuth]);

  if (loading) return <div>Loading...</div>;
  return <>{children}</>;
}