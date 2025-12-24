import { getAuthHeader } from "./auth";

const API_BASE_URL = "http://localhost:8080/api";

export interface TherapistInfo {
  idUser: number;
  name: string;
  surname: string;
  email: string;
  officeLocation: string;
  degree: string;
  yearsExp: number;
  phoneNumber: string;
  freeConsultationSlots: string[];
}

export interface Patient {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
}

export const therapistApi = {
  getAllTherapists: async (): Promise<TherapistInfo[]> => {
    const response = await fetch(`${API_BASE_URL}/therapists`, {
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch therapists");
    }

    return response.json();
  },

  getTherapistPatients: async (): Promise<Patient[]> => {
    const response = await fetch(`${API_BASE_URL}/therapists/patients`, {
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch patients");
    }

    return response.json();
  },
};
