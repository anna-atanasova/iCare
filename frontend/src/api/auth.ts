import { UserType } from "@/enums/UserType";
import { apiClient } from "@/api/client";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  email: string;
  userType: UserType;
  userId: number;
}

export interface RegisterPatientRequest {
  username: string;
  password: string;
  name: string;
  surname: string;
  email: string;
}

export interface RegisterTherapistRequest {
  username: string;
  password: string;
  name: string;
  surname: string;
  email: string;
  officeLocation: string;
  degree: string;
  yearsExp: number;
  phoneNumber: string;
}

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> =>
    apiClient.post<LoginResponse>("/auth/login", credentials),

  registerPatient: async (
    data: RegisterPatientRequest,
  ): Promise<LoginResponse> =>
    apiClient.post<LoginResponse>("/auth/register/patient", data),

  registerTherapist: async (
    data: RegisterTherapistRequest,
  ): Promise<LoginResponse> =>
    apiClient.post<LoginResponse>("/auth/register/therapist", data),
};
