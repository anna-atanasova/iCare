import { getAuthHeader } from "./auth";

const API_BASE_URL = "http://localhost:8080/api";

export interface Patient {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
}

export const patientApi = {
  getAllPatients: async (): Promise<Patient[]> => {
    const response = await fetch(`${API_BASE_URL}/patients`, {
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch patients");
    }

    return response.json();
  },

  setTherapist: async (therapistId: number): Promise<void> => {
    const response = await fetch(
      `${API_BASE_URL}/patients/therapist/${therapistId}`,
      {
        method: "PUT",
        headers: getAuthHeader(),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to set therapist");
    }
  },

  removeTherapist: async (): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/patients/therapist`, {
      method: "DELETE",
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to remove therapist");
    }
  },

  getCurrentTherapist: async (): Promise<number | null> => {
    const response = await fetch(`${API_BASE_URL}/patients/therapist`, {
      headers: getAuthHeader(),
    });

    if (response.status === 204) {
      return null;
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch current therapist");
    }

    return response.json();
  },
};
