import { apiClient } from "@/api/client";

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
  ): Promise<DiaryEntry[]> =>
    apiClient.get<DiaryEntry[]>(
      `/diary/${patientId}?year=${year}&month=${month}`,
    ),

  createDiaryEntry: async (
    data: CreateDiaryEntryRequest,
  ): Promise<DiaryEntry> => apiClient.post<DiaryEntry>("/diary", data),

  updateDiaryEntry: async (
    diaryId: number,
    data: UpdateDiaryEntryRequest,
  ): Promise<DiaryEntry> =>
    apiClient.put<DiaryEntry>(`/diary/${diaryId}`, data),

  deleteDiaryEntry: async (diaryId: number): Promise<void> =>
    apiClient.delete<void>(`/diary/${diaryId}`),
};
