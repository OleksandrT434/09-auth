import type { User } from './user';

export type SessionResponse = {
  authenticated: boolean;
  user: User | null;
};

export type RefreshResult = {
  accessToken: string;
  refreshToken?: string;
};