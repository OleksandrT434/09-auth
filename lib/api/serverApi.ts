import { cookies } from "next/headers";
import { nextServer } from "./api";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";

interface NotesHttpResponse {
  notes: Note[];
  totalPages: number;
}

function cookieHeader() {
  return cookies().toString(); 
}

export const checkServerSession = async () => {
  const cookieStore = await cookies();
  const res = await nextServer.get('/auth/session', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return res;
};


export async function getServerMe(): Promise<User> {
  const { data } = await nextServer.get<User>("/users/me", {
    headers: { Cookie: cookieHeader() },
  });
  return data;
}

export async function fetchNotesServer(
  search: string,
  page: number,
  tag?: string
): Promise<NotesHttpResponse> {
  const params = { ...(search && { search }), ...(tag && { tag }), page, perPage: 12 };
  const { data } = await nextServer.get<NotesHttpResponse>("/notes", {
    params,
    headers: { Cookie: cookieHeader() },
  });
  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const { data } = await nextServer.get<Note>(`/notes/${id}`, {
    headers: { Cookie: cookieHeader() },
  });
  return data;
}
