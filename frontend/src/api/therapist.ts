import { apiClient } from "@/api/client";

export interface TherapistInfo {
  idUser: number;
  name: string;
  surname: string;
  email: string;
  officeLocation: string;
  degree: string;
  yearsExp: number;
  phoneNumber: string;
  freeConsultationSlots: string[];
}

export interface Patient {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
}

export const therapistApi = {
  getAllTherapists: async (): Promise<TherapistInfo[]> =>
    apiClient.get<TherapistInfo[]>("/therapists"),

  getTherapistPatients: async (): Promise<Patient[]> =>
    apiClient.get<Patient[]>("/therapists/patients"),
};
