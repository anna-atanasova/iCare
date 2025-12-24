package com.finki.icare.controller;

import com.finki.icare.config.JwtAuthenticationToken;
import com.finki.icare.dto.PatientDTO;
import com.finki.icare.dto.TherapistDTO;
import com.finki.icare.exceptions.ICareException;
import com.finki.icare.service.TherapistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/therapists")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class TherapistController {

    private final TherapistService therapistService;

    private Integer getUserId(Authentication authentication) {
        if (authentication instanceof JwtAuthenticationToken jwtAuth) {
            return jwtAuth.getUserId();
        }
        throw ICareException.unauthorized("Authentication required");
    }

    @GetMapping
    public ResponseEntity<List<TherapistDTO>> getAllTherapists() {
        List<TherapistDTO> therapists = therapistService.getAllTherapistsWithFreeSlots();
        return ResponseEntity.ok(therapists);
    }

    @GetMapping("/patients")
    public ResponseEntity<List<PatientDTO>> getTherapistPatients(Authentication authentication) {
        Integer therapistId = getUserId(authentication);
        List<PatientDTO> patients = therapistService.getTherapistPatients(therapistId);
        return ResponseEntity.ok(patients);
    }
}
