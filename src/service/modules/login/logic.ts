import { api } from "@/service";
import { AUTH_TOKEN_KEY } from "@/lib";

const USER_STORAGE_KEY = "user";

export interface LoginResponse {
    success: boolean;
    message?: string;
    data : InforResponse;
}

export interface InforResponse {
    id: number;
    email: string;
    name: string
}

export const login = async (
  username: string,
  password: string,
  dbname: string
): Promise<LoginResponse> => {
  return api.post<LoginResponse>("/auth/login", {
    username,
    password,
    dbname,
  });
};

const AUTH_KEYS_TO_CLEAR = [USER_STORAGE_KEY, AUTH_TOKEN_KEY, "token", "session_id"] as const;

export function logout(): void {
  if (typeof window === "undefined") return;
  sessionStorage.clear();
  AUTH_KEYS_TO_CLEAR.forEach((key) => localStorage.removeItem(key));
  window.location.href = "/login";
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem(USER_STORAGE_KEY);
}