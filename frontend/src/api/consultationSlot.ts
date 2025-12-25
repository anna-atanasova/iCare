import { getAuthHeader, getAuthHeaderJson } from "@/api/auth";

const API_BASE_URL = "http://localhost:8080/api";

export interface ConsultationSlot {
  consultationSlots: string[]; // ISO date strings
}

export const consultationSlotApi = {
  getSlots: async (therapistId: number): Promise<ConsultationSlot> => {
    const response = await fetch(
      `${API_BASE_URL}/consultation-slots/${therapistId}`,
      {
        headers: getAuthHeader(),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch consultation slots");
    }

    return response.json();
  },

  addSlot: async (
    therapistId: number,
    date: string,
  ): Promise<ConsultationSlot> => {
    const response = await fetch(
      `${API_BASE_URL}/consultation-slots/${therapistId}`,
      {
        method: "POST",
        headers: getAuthHeaderJson(),
        body: JSON.stringify({ date }),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to add consultation slot");
    }

    return response.json();
  },

  removeSlot: async (
    therapistId: number,
    date: string,
  ): Promise<ConsultationSlot> => {
    const response = await fetch(
      `${API_BASE_URL}/consultation-slots/${therapistId}/${date}`,
      {
        method: "DELETE",
        headers: getAuthHeader(),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to remove consultation slot");
    }

    return response.json();
  },
};
