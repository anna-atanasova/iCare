import { getAuthHeader, getAuthHeaderJson } from "@/api/auth";

const API_BASE_URL = "http://localhost:8080/api";

export interface Therapy {
  idTherapy: number;
  name: string;
  dose: string;
  expDate: string;
  consultationId: number;
}

export interface CreateTherapyRequest {
  name: string;
  dose: string;
  expDate: string;
}

export interface UpdateTherapyRequest {
  name?: string;
  dose?: string;
  expDate?: string;
}

export const therapyApi = {
  getTherapiesByConsultation: async (
    consultationId: number,
  ): Promise<Therapy[]> => {
    const response = await fetch(
      `${API_BASE_URL}/therapies/consultation/${consultationId}`,
      {
        headers: getAuthHeader(),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch therapies");
    }

    return response.json();
  },

  createTherapy: async (
    consultationId: number,
    data: CreateTherapyRequest,
  ): Promise<Therapy> => {
    const response = await fetch(
      `${API_BASE_URL}/therapies/consultation/${consultationId}`,
      {
        method: "POST",
        headers: getAuthHeaderJson(),
        body: JSON.stringify(data),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create therapy");
    }

    return response.json();
  },

  updateTherapy: async (
    therapyId: number,
    data: UpdateTherapyRequest,
  ): Promise<Therapy> => {
    const response = await fetch(`${API_BASE_URL}/therapies/${therapyId}`, {
      method: "PUT",
      headers: getAuthHeaderJson(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update therapy");
    }

    return response.json();
  },

  deleteTherapy: async (therapyId: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/therapies/${therapyId}`, {
      method: "DELETE",
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete therapy");
    }
  },
};
