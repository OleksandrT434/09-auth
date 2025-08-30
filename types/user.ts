export interface User {
  id: string;
  email: string;
  username?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}