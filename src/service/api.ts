import axios, { type AxiosInstance } from "axios";
import { AUTH_TOKEN_KEY, SESSION_ID_HEADER } from "@/lib";
import { API_BASE_URL } from "@/lib/constants";

const LOGIN_PATH = "/login";

function redirectToLogin(): void {
  if (typeof window === "undefined") return;
  window.location.href = LOGIN_PATH;
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(AUTH_TOKEN_KEY);
}

const baseURL = (API_BASE_URL ?? "").replace(/\/$/, "");

const client: AxiosInstance = axios.create({
  baseURL: baseURL || undefined,
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers[SESSION_ID_HEADER] = token;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 404 || status === 401) {
      redirectToLogin();
    }
    const message = error.response?.data?.message ?? error.message ?? "Request failed";
    const err = new Error(typeof message === "string" ? message : JSON.stringify(message)) as Error & { status?: number };
    err.status = status;
    return Promise.reject(err);
  }
);

export const api = {
  get: <T>(path: string, params?: Record<string, string>) =>
    client.get<T>(path, { params }).then((res) => res.data),

  post: <T>(path: string, body?: object) =>
    client.post<T>(path, body).then((res) => res.data),

  postFormData: <T>(path: string, formData: FormData) =>
    client.post<T>(path, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }).then((res) => res.data),

  put: <T>(path: string, body?: object) =>
    client.put<T>(path, body).then((res) => res.data),

  delete: <T>(path: string) =>
    client.delete<T>(path).then((res) => res.data),
};
