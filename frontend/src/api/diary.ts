import { getAuthHeader, getAuthHeaderJson } from "./auth";

const API_BASE_URL = "http://localhost:8080/api";

export interface DiaryEntry {
  idDiary: number;
  date: string; // ISO date string
  dailyRating: number;
  content: string;
}

export interface CreateDiaryEntryRequest {
  dailyRating: number;
  content: string;
}

export interface UpdateDiaryEntryRequest {
  content: string;
  dailyRating?: number; // only for the current day's entries
}

export const diaryApi = {
  getDiaryEntries: async (
    patientId: number,
    year: number,
    month: number,
  ): Promise<DiaryEntry[]> => {
    const response = await fetch(
      `${API_BASE_URL}/diary/${patientId}?year=${year}&month=${month}`,
      {
        headers: getAuthHeader(),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch diary entries");
    }

    return response.json();
  },

  createDiaryEntry: async (
    data: CreateDiaryEntryRequest,
  ): Promise<DiaryEntry> => {
    const response = await fetch(`${API_BASE_URL}/diary`, {
      method: "POST",
      headers: getAuthHeaderJson(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create diary entry");
    }

    return response.json();
  },

  updateDiaryEntry: async (
    diaryId: number,
    data: UpdateDiaryEntryRequest,
  ): Promise<DiaryEntry> => {
    const response = await fetch(`${API_BASE_URL}/diary/${diaryId}`, {
      method: "PUT",
      headers: getAuthHeaderJson(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update diary entry");
    }

    return response.json();
  },

  deleteDiaryEntry: async (diaryId: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/diary/${diaryId}`, {
      method: "DELETE",
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete diary entry");
    }
  },
};
