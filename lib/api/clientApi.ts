import { User } from "@/types/user";
import { nextServer } from "./api";
import { NewNoteData, Note, FetchNotesResponse } from "@/types/note";


export interface LoginRequest {
    email: string;
    password: string;
}
export interface RegisterRequest {
    email: string;
    password: string;
}
export interface CheckSessionRequest {
    success: boolean;
}
export interface UpdateUserRequest {
    username?: string;
}
export const register = async (data: RegisterRequest): Promise<User> => {
    const res = await nextServer.post<User>("/auth/register", data);
    return res.data;
};
export const login = async (data: LoginRequest): Promise<User> => {
    const res = await nextServer.post<User>("auth/login", data);
    return res.data;
};
export const logout = async (): Promise<void> => {
    await nextServer.post("auth/logout");
};

export const checkSession = async (): Promise<boolean> => {
    const res = await nextServer.get<CheckSessionRequest>("/auth/session");
    return res.data.success;
}

export const getMe = async (): Promise<User> => {
    const { data } = await nextServer.get<User>("users/me");
    return data;
};

export const updateMe = async (payload: UpdateUserRequest) => {
    const res = await nextServer.patch<User>("/users/me", payload);
    return res.data;
}


export const fetchNotes = async (
  search: string,
  page: number,
  tag: string | undefined
): Promise<FetchNotesResponse> => {
  const params = {
    ...(search && { search }),
    tag,
    page,
    perPage: 12,
  };

  const response = await nextServer.get<FetchNotesResponse>("/notes", { params });
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

export async function fetchNoteById(id: string | number): Promise<Note> {
  const response = await nextServer.get<Note>(`/notes/${id}`);
  return response.data;
}
