package com.finki.icare.service;

import com.finki.icare.dto.AddSlotRequest;
import com.finki.icare.dto.ConsultationSlotsDTO;
import com.finki.icare.exceptions.ICareException;
import com.finki.icare.model.Therapist;
import com.finki.icare.repository.TherapistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ConsultationSlotService {

    private final TherapistRepository therapistRepository;

    public ConsultationSlotsDTO getTherapistSlots(Integer therapistId, String userType) {
        if (!"THERAPIST".equals(userType)) {
            throw ICareException.forbidden("Only therapists can manage consultation slots");
        }

        Therapist therapist = therapistRepository
                .findById(therapistId)
                .orElseThrow(() -> ICareException.notFound("Therapist not found"));

        List<LocalDate> slots = therapist.getConsultationSlots() != null
                ? Arrays.asList(therapist.getConsultationSlots())
                : new ArrayList<>();

        return new ConsultationSlotsDTO(slots);
    }

    public ConsultationSlotsDTO addSlot(Integer therapistId, AddSlotRequest request, Integer currentUserId, String userType) {
        if (!"THERAPIST".equals(userType)) {
            throw ICareException.forbidden("Only therapists can manage consultation slots");
        }

        if (!therapistId.equals(currentUserId)) {
            throw ICareException.forbidden("You can only manage your own consultation slots");
        }

        Therapist therapist = therapistRepository
                .findById(therapistId)
                .orElseThrow(() -> ICareException.notFound("Therapist not found"));

        if (request.getDate().isBefore(LocalDate.now())) {
            throw ICareException.badRequest("Cannot add slots for past dates");
        }

        List<LocalDate> slots = therapist.getConsultationSlots() != null
                ? new ArrayList<>(Arrays.asList(therapist.getConsultationSlots()))
                : new ArrayList<>();

        if (slots.contains(request.getDate())) {
            throw ICareException.conflict("This date is already in your consultation slots");
        }

        slots.add(request.getDate());
        slots.sort(LocalDate::compareTo);

        therapist.setConsultationSlots(slots.toArray(new LocalDate[0]));
        therapistRepository.save(therapist);

        return new ConsultationSlotsDTO(slots);
    }

    public ConsultationSlotsDTO removeSlot(Integer therapistId, LocalDate date, Integer currentUserId, String userType) {
        if (!"THERAPIST".equals(userType)) {
            throw ICareException.forbidden("Only therapists can manage consultation slots");
        }

        if (!therapistId.equals(currentUserId)) {
            throw ICareException.forbidden("You can only manage your own consultation slots");
        }

        Therapist therapist = therapistRepository
                .findById(therapistId)
                .orElseThrow(() -> ICareException.notFound("Therapist not found"));

        if (therapist.getConsultationSlots() == null) {
            throw ICareException.notFound("No consultation slots found");
        }

        if (date.isBefore(LocalDate.now())) {
            throw ICareException.badRequest("Cannot add slots for past dates");
        }

        List<LocalDate> slots = new ArrayList<>(Arrays.asList(therapist.getConsultationSlots()));

        if (!slots.remove(date)) {
            throw ICareException.notFound("This date is not in your consultation slots");
        }

        therapist.setConsultationSlots(slots.toArray(new LocalDate[0]));
        therapistRepository.save(therapist);

        return new ConsultationSlotsDTO(slots);
    }
}
