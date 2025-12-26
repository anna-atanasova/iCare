import { apiClient } from "@/api/client";

export interface ConsultationSlot {
  consultationSlots: string[]; // ISO date strings
}

export const consultationSlotApi = {
  getSlots: async (therapistId: number): Promise<ConsultationSlot> =>
    apiClient.get<ConsultationSlot>(`/consultation-slots/${therapistId}`),

  addSlot: async (
    therapistId: number,
    date: string,
  ): Promise<ConsultationSlot> =>
    apiClient.post<ConsultationSlot>(`/consultation-slots/${therapistId}`, {
      date,
    }),

  removeSlot: async (
    therapistId: number,
    date: string,
  ): Promise<ConsultationSlot> =>
    apiClient.delete<ConsultationSlot>(
      `/consultation-slots/${therapistId}/${date}`,
    ),
};
