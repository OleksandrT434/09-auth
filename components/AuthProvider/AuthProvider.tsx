'use client';

import { useEffect, useState } from 'react';
import { getMe } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const setAuth = useAuthStore((s) => s.setUser);
  const clearAuth = useAuthStore((s) => s.clearIsAuthenticated);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const user = await getMe(); 
        setAuth(user);
      } catch {
        clearAuth();
      } finally {
        setLoading(false);
      }
    })();
  }, [setAuth, clearAuth]);

  if (loading) return <div>Loading...</div>;
  return <>{children}</>;
}
