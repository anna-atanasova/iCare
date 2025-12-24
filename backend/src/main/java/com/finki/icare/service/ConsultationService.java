package com.finki.icare.service;

import com.finki.icare.dto.ConsultationDTO;
import com.finki.icare.dto.CreateConsultationRequest;
import com.finki.icare.dto.UpdateConsultationRequest;
import com.finki.icare.exceptions.ICareException;
import com.finki.icare.mapper.ConsultationMapper;
import com.finki.icare.model.Consultation;
import com.finki.icare.model.Patient;
import com.finki.icare.model.Therapist;
import com.finki.icare.repository.ConsultationRepository;
import com.finki.icare.repository.PatientRepository;
import com.finki.icare.repository.TherapistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ConsultationService {

    private final ConsultationRepository consultationRepository;
    private final PatientRepository patientRepository;
    private final TherapistRepository therapistRepository;
    private final ConsultationMapper consultationMapper;

    public List<ConsultationDTO> getTherapistConsultations(Integer therapistId, Integer currentUserId, String userType) {
        if (!"THERAPIST".equals(userType) || !therapistId.equals(currentUserId)) {
            throw ICareException.forbidden("You do not have permission to view these consultations");
        }

        List<Consultation> consultations = consultationRepository.findByTherapistId(therapistId);
        return consultations.stream()
                .map(consultationMapper::toDTO)
                .toList();
    }

    public ConsultationDTO createConsultation(CreateConsultationRequest request, Integer currentUserId, String userType) {
        if (!"THERAPIST".equals(userType)) {
            throw ICareException.forbidden("Only therapists can create consultation records");
        }

        Patient patient = patientRepository
                .findById(request.getPatientId())
                .orElseThrow(() -> ICareException.notFound("Patient not found"));

        Therapist therapist = therapistRepository
                .findById(currentUserId)
                .orElseThrow(() -> ICareException.notFound("Therapist not found"));

        if (request.getPrice() == null || request.getPrice().compareTo(java.math.BigDecimal.ZERO) <= 0) {
            throw ICareException.badRequest("Price must be a positive value");
        }

        if (request.getDate() == null) {
            throw ICareException.badRequest("Consultation date is required");
        }

        Consultation consultation = new Consultation();
        consultation.setPatient(patient);
        consultation.setTherapist(therapist);
        consultation.setDate(request.getDate());
        consultation.setPrice(request.getPrice());
        consultation.setAdvice(request.getAdvice());
        consultation.setDateOfPayment(request.getDateOfPayment());

        Consultation savedConsultation = consultationRepository.save(consultation);
        return consultationMapper.toDTO(savedConsultation);
    }

    public ConsultationDTO updateConsultation(Integer consultationId, UpdateConsultationRequest request, Integer currentUserId, String userType) {
        if (!"THERAPIST".equals(userType)) {
            throw ICareException.forbidden("Only therapists can update consultation records");
        }

        Consultation consultation = consultationRepository.findById(consultationId)
                .orElseThrow(() -> ICareException.notFound("Consultation not found"));

        if (!consultation.getTherapist().getIdUser().equals(currentUserId)) {
            throw ICareException.forbidden("You can only update your own consultation records");
        }

        if (request.getDate() != null) {
            consultation.setDate(request.getDate());
        }

        if (request.getPrice() != null) {
            if (request.getPrice().compareTo(java.math.BigDecimal.ZERO) <= 0) {
                throw ICareException.badRequest("Price must be a positive value");
            }
            consultation.setPrice(request.getPrice());
        }

        if (request.getAdvice() != null) {
            consultation.setAdvice(request.getAdvice());
        }

        consultation.setDateOfPayment(request.getDateOfPayment());

        Consultation updatedConsultation = consultationRepository.save(consultation);
        return consultationMapper.toDTO(updatedConsultation);
    }

    public void deleteConsultation(Integer consultationId, Integer currentUserId, String userType) {
        if (!"THERAPIST".equals(userType)) {
            throw ICareException.forbidden("Only therapists can delete consultation records");
        }

        Consultation consultation = consultationRepository.findById(consultationId)
                .orElseThrow(() -> ICareException.notFound("Consultation not found"));

        if (!consultation.getTherapist().getIdUser().equals(currentUserId)) {
            throw ICareException.forbidden("You can only delete your own consultation records");
        }

        consultationRepository.delete(consultation);
    }
}
