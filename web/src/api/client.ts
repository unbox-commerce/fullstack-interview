import { getSessionToken } from "../auth";

export const apiFetch = async <T>(path: string, params?: Record<string, string>): Promise<T> => {
  const url = new URL(path, import.meta.env.VITE_API_URL);
  for (const [key, value] of Object.entries(params ?? {})) {
    url.searchParams.set(key, value);
  }
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${getSessionToken()}` },
  });
  if (!res.ok) {
    throw new Error(`API request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
};
