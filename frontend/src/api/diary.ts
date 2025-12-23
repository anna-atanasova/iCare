import { getAuthHeader } from "./auth";

const API_BASE_URL = "http://localhost:8080/api";

export interface DiaryEntry {
  idDiary: number;
  date: string; // ISO date string
  dailyRating: number;
  content: string;
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
};
