import { apiClient } from "@/api/client";
import type { Therapy } from "@/api/therapy";

export interface Consultation {
  idConsultation: number;
  patientId: number;
  patientName: string;
  therapistId: number;
  therapistName: string;
  date: string;
  dateOfPayment: string | null;
  price: number;
  advice: string;
  therapies: Therapy[];
}

export const isConsultationPaid = (consultation: Consultation): boolean =>
  consultation.dateOfPayment !== null;

export interface CreateConsultationRequest {
  patientId: number;
  date: string;
  price: number;
  advice: string;
  dateOfPayment?: string | null;
  therapies?: Array<{
    name: string;
    dose: string;
    expDate: string;
  }>;
}

export interface UpdateConsultationRequest {
  date?: string;
  price?: number;
  advice?: string;
  dateOfPayment?: string | null;
  therapies?: Array<{
    name: string;
    dose: string;
    expDate: string;
  }>;
}

export const consultationApi = {
  getTherapistConsultations: async (
    therapistId: number,
  ): Promise<Consultation[]> =>
    apiClient.get<Consultation[]>(`/consultations/therapist/${therapistId}`),

  getPatientConsultations: async (patientId: number): Promise<Consultation[]> =>
    apiClient.get<Consultation[]>(`/consultations/patient/${patientId}`),

  createConsultation: async (
    data: CreateConsultationRequest,
  ): Promise<Consultation> =>
    apiClient.post<Consultation>("/consultations", data),

  updateConsultation: async (
    consultationId: number,
    data: UpdateConsultationRequest,
  ): Promise<Consultation> =>
    apiClient.put<Consultation>(`/consultations/${consultationId}`, data),

  deleteConsultation: async (consultationId: number): Promise<void> =>
    apiClient.delete<void>(`/consultations/${consultationId}`),
};
