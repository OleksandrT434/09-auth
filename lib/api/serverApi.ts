import { cookies } from "next/headers";
import axios from "axios";
import  getBaseUrl  from "./api";
import type { UserMe} from "@/types/user";


export default async function userInfoServer(): Promise<UserMe> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.getAll().map((c) => `${c.name}=${c.value}`);
  const res = await axios.get<UserMe>(`${getBaseUrl()}/api/users/me`, {
    headers: {
      Cookie: cookieHeader, 
    },
    withCredentials: true,
  });

  return res.data;
}
