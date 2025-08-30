import axios from 'axios';

export default function getBaseUrl(): string {

  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  return 'https://notehub-api.goit.study';
}

export const nextServer = axios.create({
  baseURL: getBaseUrl() + '/api',
  withCredentials: true,
});