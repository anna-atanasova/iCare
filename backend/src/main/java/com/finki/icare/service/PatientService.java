package com.finki.icare.service;

import com.finki.icare.exceptions.ICareException;
import com.finki.icare.model.Patient;
import com.finki.icare.model.Therapist;
import com.finki.icare.repository.PatientRepository;
import com.finki.icare.repository.TherapistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;
    private final TherapistRepository therapistRepository;

    @Transactional
    public void setTherapist(Integer patientId, Integer therapistId) {
        Patient patient = patientRepository
                .findById(patientId)
                .orElseThrow(() -> ICareException.notFound("Patient not found"));

        Therapist therapist = therapistRepository
                .findById(therapistId)
                .orElseThrow(() -> ICareException.notFound("Therapist not found"));

        patient.setTherapist(therapist);
        patientRepository.save(patient);
    }

    @Transactional
    public void removeTherapist(Integer patientId) {
        Patient patient = patientRepository
                .findById(patientId)
                .orElseThrow(() -> ICareException.notFound("Patient not found"));

        patient.setTherapist(null);
        patientRepository.save(patient);
    }

    public Integer getCurrentTherapistId(Integer patientId) {
        Patient patient = patientRepository
                .findById(patientId)
                .orElseThrow(() -> ICareException.notFound("Patient not found"));

        return patient.getTherapist() != null ? patient.getTherapist().getIdUser() : null;
    }
}
