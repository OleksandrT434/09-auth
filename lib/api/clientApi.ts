import { nextServer } from './api';
import type { Note, NewNoteData, FetchNotesResponse, Params } from '@/types/note';
import type { User } from '@/types/user';

export type UserRequest = {
  email: string;
  password: string;
};


export const registerUser = async (user: UserRequest): Promise<User> => {
  const { data } = await nextServer.post<User>('/auth/register', user);
  return data;
};


export const loginUser = async (user: UserRequest): Promise<User> => {
  const { data } = await nextServer.post<User>('/auth/login', user);
  return data;
};

export const logoutUser = async ()=> {
  const { data } = await nextServer.post('/auth/logout');
  return data.success;
};

export const checkSessionClient = async (): Promise<User> => {
  const { data } = await nextServer.get<User>('/auth/session');
  return data;
};

export const getUserInfo = async (): Promise<User> => {
  const { data } = await nextServer.get<User>('/users/me');
  return data;
};


export async function updateUser(data: Partial<Pick<User, 'username'>>): Promise<User> {
  const res = await nextServer.patch<User>('/users/me', data);
  return res.data;
}

//----------NOTES ----------//
export async function fetchNotes(
  page: number = 1,
  perPage: number = 12,
  searchValue: string = '',
  sortBy?: 'created' | 'updated',
  tag?: string
): Promise<FetchNotesResponse> {
  const params: Params = { page, perPage };

  if (searchValue.trim()) {
    params.search = searchValue.trim();
  }
  if (sortBy) {
    params.sortBy = sortBy;
  }
  if (tag && tag !== 'All') {
    params.tag = tag;
  }

  const { data } = await nextServer.get<FetchNotesResponse>('/notes', { params });
  return data;
}

export const createNote = async (noteData: NewNoteData): Promise<Note> => {
  const { data } = await nextServer.post<Note>('/notes', noteData);
  return data;
};


export const updateNote = async (id: string, noteData: Partial<NewNoteData>): Promise<Note> => {
  const { data } = await nextServer.patch<Note>(`/notes/${id}`, noteData);
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
