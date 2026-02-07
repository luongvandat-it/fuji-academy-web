import { api } from "@/service";

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