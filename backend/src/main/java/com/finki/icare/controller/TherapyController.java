package com.finki.icare.controller;

import com.finki.icare.dto.CreateTherapyRequest;
import com.finki.icare.dto.TherapyDTO;
import com.finki.icare.dto.UpdateTherapyRequest;
import com.finki.icare.service.TherapyService;
import com.finki.icare.utils.AuthUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/therapies")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class TherapyController {

    private final TherapyService therapyService;

    @GetMapping("/consultation/{consultationId}")
    public ResponseEntity<List<TherapyDTO>> getTherapiesByConsultation(
            @PathVariable Integer consultationId,
            Authentication authentication
    ) {
        Integer currentUserId = AuthUtils.getUserId(authentication);
        String userType = AuthUtils.getUserType(authentication);

        List<TherapyDTO> therapies = therapyService.getTherapiesByConsultation(
                consultationId, currentUserId, userType
        );
        return ResponseEntity.ok(therapies);
    }

    @PostMapping("/consultation/{consultationId}")
    public ResponseEntity<TherapyDTO> createTherapy(
            @PathVariable Integer consultationId,
            @RequestBody CreateTherapyRequest request,
            Authentication authentication
    ) {
        Integer currentUserId = AuthUtils.getUserId(authentication);
        String userType = AuthUtils.getUserType(authentication);

        TherapyDTO therapy = therapyService.createTherapy(
                consultationId, request, currentUserId, userType
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(therapy);
    }

    @PutMapping("/{therapyId}")
    public ResponseEntity<TherapyDTO> updateTherapy(
            @PathVariable Integer therapyId,
            @RequestBody UpdateTherapyRequest request,
            Authentication authentication
    ) {
        Integer currentUserId = AuthUtils.getUserId(authentication);
        String userType = AuthUtils.getUserType(authentication);

        TherapyDTO therapy = therapyService.updateTherapy(
                therapyId, request, currentUserId, userType
        );
        return ResponseEntity.ok(therapy);
    }

    @DeleteMapping("/{therapyId}")
    public ResponseEntity<Void> deleteTherapy(
            @PathVariable Integer therapyId,
            Authentication authentication
    ) {
        Integer currentUserId = AuthUtils.getUserId(authentication);
        String userType = AuthUtils.getUserType(authentication);

        therapyService.deleteTherapy(therapyId, currentUserId, userType);
        return ResponseEntity.noContent().build();
    }
}

