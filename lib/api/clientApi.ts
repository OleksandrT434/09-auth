import { User } from "@/types/user";
import { nextServer } from "./api";
import { NewNoteData, Note } from "@/types/note";

interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface SignupRequest {
  email: string;
  password: string;
}

export type LoginRequest = {
  email: string;
  password: string;
};

export const userRegister = async (data: SignupRequest): Promise<User> => {
  const res = await nextServer.post<User>("/auth/register", data);
  return res.data;
};

export const login = async (data: LoginRequest): Promise<User> => {
  const res = await nextServer.post<User>("/auth/login", data);
  return res.data;
};

export const getMe = async (): Promise<User> => {
  const { data } = await nextServer.get<User>("/users/me");
  return data;
};

export const updateMe = async ({
  username,
  email,
}: {
  username: string;
  email: string;
}): Promise<User> => {
  const res = await nextServer.patch<User>("/users/me", { username, email });
  return res.data;
};

export const logout = async (): Promise<void> => {
  await nextServer.post("/auth/logout");
};

type CheckSessionResponse = { success: boolean };

export const checkSession = async (): Promise<boolean> => {
  const res = await nextServer.get<CheckSessionResponse>("/auth/session");
  return res.data.success;
};

export const fetchNotes = async (
  search: string,
  page: number,
  tag: string | undefined
): Promise<NotesResponse> => {
  const params = {
    ...(search && { search }),
    tag,
    page,
    perPage: 12,
  };

  const response = await nextServer.get<NotesResponse>("/notes", {
    params,
  });
  return response.data;
};

export const createNote = async (note: NewNoteData): Promise<Note> => {
  const response = await nextServer.post<Note>("/notes", note);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await nextServer.delete<Note>(`/notes/${id}`);
  return response.data;
};

export async function fetchNoteById (id: string | number): Promise<Note> {
  const response = await nextServer.get(`/notes/${id}`);
  return response.data;
};