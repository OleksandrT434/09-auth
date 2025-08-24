import axios from 'axios';
import type { User } from '../../types/user';
import type { AxiosResponse } from 'axios';
import type { Note, NewNoteData } from '../../types/note';
import { nextServer } from './api'

export interface PaginatedNotes {
  notes: Note[];
  totalPages: number;
}

export type RegisterRequest = {
  email: string;
  password: string;
};
export type LoginRequest = {
  email: string;
  password: string;
};

export const register = async (data: RegisterRequest) => {
  const res = await nextServer.post<User>('/auth/register', data);
  return res.data;
};
export const login = async (data: LoginRequest) => {
  const res = await nextServer.post<User>('/auth/login', data);
  return res.data;
};
export async function getMe(): Promise<User> {
  const res = await nextServer.get<User>('/users/me');
  return res.data;
}

export async function updateMe(data: Partial<Pick<User, 'userName'>>): Promise<User> {
  const res = await nextServer.patch<User>('/users/me', data);
  return res.data;
}

export const logout = async (): Promise<void> => {
  await nextServer.post('/auth/logout')
};
export const checkSession = async () => {
  const res = await nextServer.get<User>('/auth/session');
  return res.data;
};

export async function fetchNotes(page: number = 1, perPage: number = 12, search: string, sortBy?: 'created' | 'updated', tag?:string): Promise<PaginatedNotes> {
  const params: Record<string, string | number> = { page, perPage };

  if (search && search.trim()) {
    params.search = search.trim();
  }
  if (sortBy) {
    params.sortBy = sortBy;
  }
  if (tag && tag !== 'All') {
    params.tag = tag;
  }

  const response:AxiosResponse<PaginatedNotes> = await nextServer.get('/notes', { params }) ;
  return response.data;
}

export async function createNote(noteData: NewNoteData): Promise<Note> {
  const response: AxiosResponse<Note> = await nextServer.post('/notes', noteData);
  return response.data;
} 

export async function deleteNote(id: string): Promise<Note> {
  const response: AxiosResponse<Note> = await nextServer.delete(`/notes/${id}`);
  return response.data;
}

export async function fetchNoteById (id: string | number): Promise<Note> {
  const response: AxiosResponse<Note> = await nextServer.get(`/notes/${id}`);
  return response.data;
};

