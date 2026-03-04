package com.finki.icare.controller;

import com.finki.icare.dto.PatientDTO;
import com.finki.icare.service.PatientService;
import com.finki.icare.utils.AuthUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "http://localhost:3000")
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @PutMapping("/therapist/{therapistId}")
    public ResponseEntity<Void> setTherapist(
            @PathVariable Integer therapistId,
            Authentication authentication) {
        Integer patientId = AuthUtils.getUserId(authentication);
        patientService.setTherapist(patientId, therapistId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/therapist")
    public ResponseEntity<Void> removeTherapist(Authentication authentication) {
        Integer patientId = AuthUtils.getUserId(authentication);
        patientService.removeTherapist(patientId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/therapist")
    public ResponseEntity<Integer> getCurrentTherapist(Authentication authentication) {
        Integer patientId = AuthUtils.getUserId(authentication);
        Integer therapistId = patientService.getCurrentTherapistId(patientId);
        if (therapistId == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(therapistId);
    }

    @GetMapping
    public ResponseEntity<List<PatientDTO>> getAllPatients() {
        List<PatientDTO> patients = patientService.getAllPatients();
        return ResponseEntity.ok(patients);
    }
}
