package com.finki.icare.service;

import com.finki.icare.dto.PatientDTO;
import com.finki.icare.dto.TherapistDTO;
import com.finki.icare.mapper.PatientMapper;
import com.finki.icare.mapper.TherapistMapper;
import com.finki.icare.model.Patient;
import com.finki.icare.model.Therapist;
import com.finki.icare.repository.PatientRepository;
import com.finki.icare.repository.TherapistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TherapistService {

    private final TherapistRepository therapistRepository;
    private final TherapistMapper therapistMapper;
    private final PatientRepository patientRepository;
    private final PatientMapper patientMapper;

    public List<TherapistDTO> getAllTherapistsWithFreeSlots() {
        List<Therapist> therapists = therapistRepository.findAll();

        return therapists.stream()
                .map(therapistMapper::toDTO)
                .toList();
    }

    public List<PatientDTO> getTherapistPatients(Integer therapistId) {
        List<Patient> patients = patientRepository.findPatientsByTherapistId(therapistId);

        return patients.stream()
                .map(patientMapper::toDTO)
                .toList();
    }
}

