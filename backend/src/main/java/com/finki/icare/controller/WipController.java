package com.finki.icare.controller;

import com.finki.icare.repository.BlogRepository;
import com.finki.icare.repository.ConsultationRepository;
import com.finki.icare.repository.PatientRepository;
import com.finki.icare.repository.TherapistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class WipController {

    private final PatientRepository patientRepository;
    private final TherapistRepository therapistRepository;
    private final BlogRepository blogRepository;
    private final ConsultationRepository consultationRepository;

    @RequestMapping("/ping")
    public String ping() {
        return "API is up and running!";
    }
}
