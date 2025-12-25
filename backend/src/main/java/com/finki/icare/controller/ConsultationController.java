package com.finki.icare.controller;

import com.finki.icare.dto.ConsultationDTO;
import com.finki.icare.dto.CreateConsultationRequest;
import com.finki.icare.dto.UpdateConsultationRequest;
import com.finki.icare.service.ConsultationService;
import com.finki.icare.utils.AuthUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/consultations")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class ConsultationController {

    private final ConsultationService consultationService;

    @GetMapping("/therapist/{therapistId}")
    public ResponseEntity<List<ConsultationDTO>> getTherapistConsultations(
            @PathVariable Integer therapistId,
            Authentication authentication
    ) {
        Integer currentUserId = AuthUtils.getUserId(authentication);
        String userType = AuthUtils.getUserType(authentication);

        List<ConsultationDTO> consultations = consultationService.getTherapistConsultations(
                therapistId, currentUserId, userType
        );
        return ResponseEntity.ok(consultations);
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<ConsultationDTO>> getPatientConsultations(
            @PathVariable Integer patientId,
            Authentication authentication
    ) {
        Integer currentUserId = AuthUtils.getUserId(authentication);
        String userType = AuthUtils.getUserType(authentication);

        List<ConsultationDTO> consultations = consultationService.getPatientConsultations(
                patientId, currentUserId, userType
        );
        return ResponseEntity.ok(consultations);
    }

    @PostMapping
    public ResponseEntity<ConsultationDTO> createConsultation(
            @RequestBody CreateConsultationRequest request,
            Authentication authentication
    ) {
        Integer currentUserId = AuthUtils.getUserId(authentication);
        String userType = AuthUtils.getUserType(authentication);

        ConsultationDTO consultation = consultationService.createConsultation(
                request, currentUserId, userType
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(consultation);
    }

    @PutMapping("/{consultationId}")
    public ResponseEntity<ConsultationDTO> updateConsultation(
            @PathVariable Integer consultationId,
            @RequestBody UpdateConsultationRequest request,
            Authentication authentication
    ) {
        Integer currentUserId = AuthUtils.getUserId(authentication);
        String userType = AuthUtils.getUserType(authentication);

        ConsultationDTO consultation = consultationService.updateConsultation(
                consultationId, request, currentUserId, userType
        );
        return ResponseEntity.ok(consultation);
    }

    @DeleteMapping("/{consultationId}")
    public ResponseEntity<Void> deleteConsultation(
            @PathVariable Integer consultationId,
            Authentication authentication
    ) {
        Integer currentUserId = AuthUtils.getUserId(authentication);
        String userType = AuthUtils.getUserType(authentication);

        consultationService.deleteConsultation(consultationId, currentUserId, userType);
        return ResponseEntity.noContent().build();
    }
}
