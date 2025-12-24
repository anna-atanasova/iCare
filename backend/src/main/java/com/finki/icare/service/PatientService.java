package com.finki.icare.service;

import com.finki.icare.dto.PatientDTO;
import com.finki.icare.exceptions.ICareException;
import com.finki.icare.mapper.PatientMapper;
import com.finki.icare.model.Patient;
import com.finki.icare.model.Therapist;
import com.finki.icare.repository.PatientRepository;
import com.finki.icare.repository.TherapistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;
    private final TherapistRepository therapistRepository;
    private final PatientMapper patientMapper;

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

    public List<PatientDTO> getAllPatients() {
        return patientRepository.findAll().stream()
                .map(patientMapper::toDTO)
                .toList();
    }
}
