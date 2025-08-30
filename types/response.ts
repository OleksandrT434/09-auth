import { AxiosError } from "axios";
import {User} from "./user"

export type SessionResponse = {
  authenticated: boolean;
  user: User | null;
};

export type CheckSession = User | null; 

export type ApiError = AxiosError<{ error: string }>