import { User, UserRequest } from '@/types/user';
import { CheckSession } from '@/types/response';
import { nextServer } from './api';
import type { FetchNotesResponse, NewNoteData, Note } from '../../types/note';

export const registration = async (user: UserRequest): Promise<User> => {
  const {data}= await nextServer.post<User>(`/auth/register`, user);
  return data;
};

export const login = async (user: UserRequest): Promise<User> => {
  const {data}= await nextServer.post<User>(`/auth/login`, user);
  return data;
};

export const logout = async () => {
  const {data}= await nextServer.post(`/auth/logout`);
  return data.success;   
};

export async function checkSessionClient() {
  const {data}= await nextServer.get<CheckSession>('/auth/session');
  return data.success;
}

export async function userInfoClient() {
  const {data} = await nextServer.get<User>('/users/me');
  return data;
}

export async function updateUser(user: Partial<User>) {
  const {data} = await nextServer.patch<User>('/users/me', user);
  return data;
}


// ---- NOTES ----
export async function fetchNotes(
  page = 1,
  perPage = 12,
  searchValue = '',
  sortBy?: 'created' | 'updated',
  tag?: string
): Promise<FetchNotesResponse> {
  const params: Record<string, string | number> = { page, perPage };
  if (searchValue.trim()) params.search = searchValue.trim();
  if (sortBy) params.sortBy = sortBy;
  if (tag && tag !== 'All') params.tag = tag;

  const { data } = await nextServer.get<FetchNotesResponse>('/notes', { params });
  return data;
}

export const createNote = async (noteData: NewNoteData): Promise<Note> => {
  const { data } = await nextServer.post<Note>('/notes', noteData);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await nextServer.delete<Note>(`/notes/${id}`);
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await nextServer.get<Note>(`/notes/${id}`);
  return data;
};
