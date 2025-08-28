import { cookies } from 'next/headers';
import { nextServer } from './api';
import type { User } from '@/types/user';
import type { Note } from '@/types/note';
import type { RefreshResult } from '@/types/response';

async function cookieHeader(): Promise<string> {
  const store = await cookies();
  return store.getAll().map(c => `${c.name}=${c.value}`).join('; ');
}

export async function getCurrentUserServer(): Promise<User> {
  const { data } = await nextServer.get<User>('/users/me', {
    headers: { Cookie: await cookieHeader() },
  });
  return data;
}
export async function checkSessionServer(
  refreshToken?: string
): Promise<RefreshResult | null> {
  const body = refreshToken ? { refreshToken } : undefined;

  const { data } = await nextServer.post<RefreshResult>('/auth/refresh', body, {
    headers: {
      Cookie: await cookieHeader(),
      'Content-Type': 'application/json',
    },
  });

  return data?.accessToken ? data : null;
}
export async function getNoteByIdServer(id: string): Promise<Note> {
  const { data } = await nextServer.get<Note>(`/notes/${id}`, {
    headers: { Cookie: await cookieHeader() },
  });
  return data;
}
