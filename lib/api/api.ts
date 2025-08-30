
import axios from "axios";

const base =
  (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");

export const nextServer = axios.create({
  baseURL: base,
  withCredentials: true,
});
