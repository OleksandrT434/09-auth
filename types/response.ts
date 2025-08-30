import type { User } from './user';

export type AuthResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
};


export type RefreshResult = {
  accessToken: string;
  refreshToken?: string;
};