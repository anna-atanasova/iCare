package com.finki.icare.controller;

import com.finki.icare.config.JwtAuthenticationToken;
import com.finki.icare.dto.AddSlotRequest;
import com.finki.icare.dto.ConsultationSlotsDTO;
import com.finki.icare.exceptions.ICareException;
import com.finki.icare.service.ConsultationSlotService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/consultation-slots")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class ConsultationSlotController {

    private final ConsultationSlotService consultationSlotService;

    private Integer getUserId(Authentication authentication) {
        if (authentication instanceof JwtAuthenticationToken jwtAuth) {
            return jwtAuth.getUserId();
        }
        throw ICareException.unauthorized("Authentication required");
    }

    private String getUserType(Authentication authentication) {
        if (authentication instanceof JwtAuthenticationToken jwtAuth) {
            return jwtAuth.getUserType();
        }
        throw ICareException.unauthorized("Authentication required");
    }

    @GetMapping("/{therapistId}")
    public ResponseEntity<ConsultationSlotsDTO> getSlots(
            @PathVariable Integer therapistId,
            Authentication authentication
    ) {
        String userType = getUserType(authentication);
        ConsultationSlotsDTO slots = consultationSlotService.getTherapistSlots(therapistId, userType);
        return ResponseEntity.ok(slots);
    }

    @PostMapping("/{therapistId}")
    public ResponseEntity<ConsultationSlotsDTO> addSlot(
            @PathVariable Integer therapistId,
            @RequestBody AddSlotRequest request,
            Authentication authentication
    ) {
        Integer currentUserId = getUserId(authentication);
        String userType = getUserType(authentication);
        ConsultationSlotsDTO slots = consultationSlotService.addSlot(therapistId, request, currentUserId, userType);
        return ResponseEntity.ok(slots);
    }

    @DeleteMapping("/{therapistId}/{date}")
    public ResponseEntity<ConsultationSlotsDTO> removeSlot(
            @PathVariable Integer therapistId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            Authentication authentication
    ) {
        Integer currentUserId = getUserId(authentication);
        String userType = getUserType(authentication);
        ConsultationSlotsDTO slots = consultationSlotService.removeSlot(therapistId, date, currentUserId, userType);
        return ResponseEntity.ok(slots);
    }
}

