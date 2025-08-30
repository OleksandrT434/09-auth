import axios from 'axios';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || '').trim().replace(/\/+$/, '');

if (!API_URL) {
  throw new Error('Set NEXT_PUBLIC_API_URL (e.g. https://notehub-api.goit.study)');
}

export const nextServer = axios.create({
  baseURL: API_URL, 
  withCredentials: true,
});
