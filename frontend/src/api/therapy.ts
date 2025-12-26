import { apiClient } from "@/api/client";

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
  ): Promise<Therapy[]> =>
    apiClient.get<Therapy[]>(`/therapies/consultation/${consultationId}`),

  createTherapy: async (
    consultationId: number,
    data: CreateTherapyRequest,
  ): Promise<Therapy> =>
    apiClient.post<Therapy>(`/therapies/consultation/${consultationId}`, data),

  updateTherapy: async (
    therapyId: number,
    data: UpdateTherapyRequest,
  ): Promise<Therapy> =>
    apiClient.put<Therapy>(`/therapies/${therapyId}`, data),

  deleteTherapy: async (therapyId: number): Promise<void> =>
    apiClient.delete<void>(`/therapies/${therapyId}`),
};
