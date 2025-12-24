package com.finki.icare.service;

import com.finki.icare.dto.CreateTherapyRequest;
import com.finki.icare.dto.TherapyDTO;
import com.finki.icare.dto.UpdateTherapyRequest;
import com.finki.icare.exceptions.ICareException;
import com.finki.icare.mapper.TherapyMapper;
import com.finki.icare.model.Consultation;
import com.finki.icare.model.Therapy;
import com.finki.icare.repository.ConsultationRepository;
import com.finki.icare.repository.TherapyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TherapyService {

    private final TherapyRepository therapyRepository;
    private final ConsultationRepository consultationRepository;
    private final TherapyMapper therapyMapper;

    public List<TherapyDTO> getTherapiesByConsultation(Integer consultationId, Integer currentUserId, String userType) {
        Consultation consultation = consultationRepository.findById(consultationId)
                .orElseThrow(() -> ICareException.notFound("Consultation not found"));

        if (!"THERAPIST".equals(userType) || !consultation.getTherapist().getIdUser().equals(currentUserId)) {
            throw ICareException.forbidden("You do not have permission to view therapies for this consultation");
        }

        List<Therapy> therapies = therapyRepository.findByConsultationId(consultationId);
        return therapies.stream()
                .map(therapyMapper::toDTO)
                .toList();
    }

    public TherapyDTO createTherapy(Integer consultationId, CreateTherapyRequest request, Integer currentUserId, String userType) {
        if (!"THERAPIST".equals(userType)) {
            throw ICareException.forbidden("Only therapists can create therapies");
        }

        Consultation consultation = consultationRepository.findById(consultationId)
                .orElseThrow(() -> ICareException.notFound("Consultation not found"));

        if (!consultation.getTherapist().getIdUser().equals(currentUserId)) {
            throw ICareException.forbidden("You can only add therapies to your own consultations");
        }

        validateTherapyRequest(request.getName(), request.getDose(), request.getExpDate());

        Therapy therapy = new Therapy();
        therapy.setConsultation(consultation);
        therapy.setName(request.getName());
        therapy.setDose(request.getDose());
        therapy.setExpDate(request.getExpDate());

        Therapy savedTherapy = therapyRepository.save(therapy);
        return therapyMapper.toDTO(savedTherapy);
    }

    public TherapyDTO updateTherapy(Integer therapyId, UpdateTherapyRequest request, Integer currentUserId, String userType) {
        if (!"THERAPIST".equals(userType)) {
            throw ICareException.forbidden("Only therapists can update therapies");
        }

        Therapy therapy = therapyRepository.findById(therapyId)
                .orElseThrow(() -> ICareException.notFound("Therapy not found"));

        if (!therapy.getConsultation().getTherapist().getIdUser().equals(currentUserId)) {
            throw ICareException.forbidden("You can only update therapies from your own consultations");
        }

        if (request.getName() != null && !request.getName().trim().isEmpty()) {
            therapy.setName(request.getName());
        }

        if (request.getDose() != null && !request.getDose().trim().isEmpty()) {
            therapy.setDose(request.getDose());
        }

        if (request.getExpDate() != null) {
            therapy.setExpDate(request.getExpDate());
        }

        Therapy updatedTherapy = therapyRepository.save(therapy);
        return therapyMapper.toDTO(updatedTherapy);
    }

    public void deleteTherapy(Integer therapyId, Integer currentUserId, String userType) {
        if (!"THERAPIST".equals(userType)) {
            throw ICareException.forbidden("Only therapists can delete therapies");
        }

        Therapy therapy = therapyRepository.findById(therapyId)
                .orElseThrow(() -> ICareException.notFound("Therapy not found"));

        if (!therapy.getConsultation().getTherapist().getIdUser().equals(currentUserId)) {
            throw ICareException.forbidden("You can only delete therapies from your own consultations");
        }

        therapyRepository.delete(therapy);
    }

    private void validateTherapyRequest(String name, String dose, java.time.LocalDate expDate) {
        if (name == null || name.trim().isEmpty()) {
            throw ICareException.badRequest("Therapy name is required");
        }

        if (dose == null || dose.trim().isEmpty()) {
            throw ICareException.badRequest("Therapy dose is required");
        }

        if (expDate == null) {
            throw ICareException.badRequest("Therapy expiration date is required");
        }
    }

    @Transactional
    public void createTherapiesForConsultation(Consultation consultation, List<CreateTherapyRequest> therapyRequests) {
        if (therapyRequests == null || therapyRequests.isEmpty()) {
            return;
        }

        List<Therapy> therapies = new ArrayList<>();

        for (CreateTherapyRequest request : therapyRequests) {
            validateTherapyRequest(request.getName(), request.getDose(), request.getExpDate());

            Therapy therapy = new Therapy();
            therapy.setConsultation(consultation);
            therapy.setName(request.getName());
            therapy.setDose(request.getDose());
            therapy.setExpDate(request.getExpDate());
            therapies.add(therapy);
        }

        therapyRepository.saveAll(therapies);
    }
}
