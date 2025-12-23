package com.finki.icare.service;

import com.finki.icare.dto.TherapistDTO;
import com.finki.icare.model.Therapist;
import com.finki.icare.repository.TherapistRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class TherapistService {

    private final TherapistRepository therapistRepository;

    public TherapistService(TherapistRepository therapistRepository) {
        this.therapistRepository = therapistRepository;
    }

    public List<TherapistDTO> getAllTherapistsWithFreeSlots() {
        List<Therapist> therapists = therapistRepository.findAll();

        return therapists.stream()
                .map(this::mapToTherapistDTO)
                .toList();
    }

    private TherapistDTO mapToTherapistDTO(Therapist therapist) {
        TherapistDTO dto = new TherapistDTO();
        dto.setIdUser(therapist.getIdUser());
        dto.setName(therapist.getName());
        dto.setSurname(therapist.getSurname());
        dto.setEmail(therapist.getEmail());
        dto.setOfficeLocation(therapist.getOfficeLocation());
        dto.setDegree(therapist.getDegree());
        dto.setYearsExp(therapist.getYearsExp());
        dto.setPhoneNumber(therapist.getPhoneNumber());

        List<LocalDate> freeSlots = new ArrayList<>();
        if (therapist.getConsultationSlots() != null) {
            freeSlots = Arrays.stream(therapist.getConsultationSlots())
                    .filter(slot -> !slot.isBefore(LocalDate.now()))
                    .sorted()
                    .toList();
        }

        dto.setFreeConsultationSlots(freeSlots);

        return dto;
    }
}

