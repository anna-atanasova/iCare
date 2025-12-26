import { apiClient } from "@/api/client";

export interface Patient {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
}

export const patientApi = {
  getAllPatients: async (): Promise<Patient[]> =>
    apiClient.get<Patient[]>("/patients"),

  setTherapist: async (therapistId: number): Promise<void> =>
    apiClient.put<void>(`/patients/therapist/${therapistId}`),

  removeTherapist: async (): Promise<void> =>
    apiClient.delete<void>("/patients/therapist"),

  getCurrentTherapist: async (): Promise<number | null> =>
    apiClient.get<number | null>("/patients/therapist"),
};
