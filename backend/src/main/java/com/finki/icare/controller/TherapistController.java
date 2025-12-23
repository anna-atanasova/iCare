package com.finki.icare.controller;

import com.finki.icare.dto.TherapistDTO;
import com.finki.icare.service.TherapistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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

    @GetMapping
    public ResponseEntity<List<TherapistDTO>> getAllTherapists() {
        List<TherapistDTO> therapists = therapistService.getAllTherapistsWithFreeSlots();
        return ResponseEntity.ok(therapists);
    }
}
