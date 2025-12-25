import { getAuthHeader, getAuthHeaderJson } from "./auth";
import { Therapy } from "./therapy";

const API_BASE_URL = "http://localhost:8080/api";

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
  ): Promise<Consultation[]> => {
    const response = await fetch(
      `${API_BASE_URL}/consultations/therapist/${therapistId}`,
      {
        headers: getAuthHeader(),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch consultations");
    }

    return response.json();
  },

  getPatientConsultations: async (
    patientId: number,
  ): Promise<Consultation[]> => {
    const response = await fetch(
      `${API_BASE_URL}/consultations/patient/${patientId}`,
      {
        headers: getAuthHeader(),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch consultations");
    }

    return response.json();
  },

  createConsultation: async (
    data: CreateConsultationRequest,
  ): Promise<Consultation> => {
    const response = await fetch(`${API_BASE_URL}/consultations`, {
      method: "POST",
      headers: getAuthHeaderJson(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create consultation");
    }

    return response.json();
  },

  updateConsultation: async (
    consultationId: number,
    data: UpdateConsultationRequest,
  ): Promise<Consultation> => {
    const response = await fetch(
      `${API_BASE_URL}/consultations/${consultationId}`,
      {
        method: "PUT",
        headers: getAuthHeaderJson(),
        body: JSON.stringify(data),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update consultation");
    }

    return response.json();
  },

  deleteConsultation: async (consultationId: number): Promise<void> => {
    const response = await fetch(
      `${API_BASE_URL}/consultations/${consultationId}`,
      {
        method: "DELETE",
        headers: getAuthHeader(),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete consultation");
    }
  },
};
