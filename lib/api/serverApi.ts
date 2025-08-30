import { nextServer } from "./api";
import { Note } from "@/types/note";
import { User } from "@/types/user";
import { cookies } from "next/headers";

interface NotesHttpResponse {
  notes: Note[];
  totalPages: number;
}

export const checkServerSession = async () => {
  const cookieStore = await cookies();
  const res = await nextServer.get("/auth/session", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return res;
};

export const getServerMe = async (): Promise<User> => {
  const cookieStore = await cookies();
  const { data } = await nextServer.get<User>("/users/me", {
    headers: { Cookie: cookieStore.toString() },
  });
  return data;
};

export const fetchNotes = async (
  cookieHeader: string,
  search: string,
  page: number,
  tag?: string
): Promise<NotesHttpResponse> => {
  const params = {
    ...(search && { search }),
    ...(tag && { tag }),
    page,
    perPage: 12,
  };

  const response = await nextServer.get<NotesHttpResponse>("/notes", {
    params,
    headers: { Cookie: cookieHeader },
  });

  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const response = await nextServer.get<Note>(`/notes/${id}`, {
    headers: { Cookie: cookieHeader },
  });

  return response.data;
};