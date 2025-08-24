'use client';
import {ReactNode, useEffect, useState } from 'react';
import { checkSession } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';

type Props = {
  children: ReactNode;
};

export default function AuthProvider({ children }:Props) {
  const clearAuth = useAuthStore((s) => s.clearIsAuthenticated);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const ok = await checkSession();
      if (!ok) clearAuth();
      setLoading(false);
    }
    init();
  }, [clearAuth]);

  if (loading) return <div>Loading...</div>;
  return <>{children}</>;
}
