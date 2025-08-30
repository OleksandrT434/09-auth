import { cookies } from 'next/headers';
import { nextServer } from './api';
import type { User } from '@/types/user';
import type { Note } from '@/types/note';
import type { RefreshResult, SessionResponse } from '@/types/response';
import { AxiosResponse } from 'axios';

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
export async function checkSessionServer(): Promise<AxiosResponse<SessionResponse>> {
  const  data  = await nextServer.get<SessionResponse>('/auth/session', {
    headers: {
      Cookie: await cookieHeader(),
      withCredentials: true,
    },
  });

  return data
}
export async function refreshSessionServer(
  refreshToken?: string
): Promise<AxiosResponse<RefreshResult>> {
  const body = refreshToken ? { refreshToken } : undefined;

  const res = await nextServer.post<RefreshResult>('/auth/refresh', body, {
    headers: {
      Cookie: await cookieHeader(),
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });

  return res;
}
export async function getNoteByIdServer(id: string): Promise<Note> {
  const res = await nextServer.get<Note>(`/notes/${id}`, {
    headers: { Cookie: await cookieHeader() },
  });
  return res.data;
}
