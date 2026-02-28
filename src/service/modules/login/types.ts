export interface LoginResponse {
  success: boolean;
  message?: string;
  data: InforResponse;
}

export interface InforResponse {
  id: number;
  email: string;
  name: string;
}
