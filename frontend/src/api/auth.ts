import { UserType } from "../enums/UserType";

const API_BASE_URL = "http://localhost:8080/api";

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

export interface ApiError {
  message: string;
}

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message || "Login failed");
    }

    return response.json();
  },

  registerPatient: async (
    data: RegisterPatientRequest,
  ): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/register/patient`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message || "Registration failed");
    }

    return response.json();
  },

  registerTherapist: async (
    data: RegisterTherapistRequest,
  ): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/register/therapist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message || "Registration failed");
    }

    return response.json();
  },
};

export const getAuthHeader = (): HeadersInit => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getAuthHeaderJson = (): HeadersInit => {
  return {
    ...getAuthHeader(),
    "Content-Type": "application/json",
  };
};
