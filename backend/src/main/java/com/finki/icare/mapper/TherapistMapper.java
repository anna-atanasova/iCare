package com.finki.icare.mapper;

import com.finki.icare.dto.TherapistDTO;
import com.finki.icare.model.Therapist;
import org.mapstruct.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface TherapistMapper {

    @Mapping(target = "idUser", source = "idUser")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "surname", source = "surname")
    @Mapping(target = "email", source = "email")
    @Mapping(target = "officeLocation", source = "officeLocation")
    @Mapping(target = "degree", source = "degree")
    @Mapping(target = "yearsExp", source = "yearsExp")
    @Mapping(target = "phoneNumber", source = "phoneNumber")
    @Mapping(target = "freeConsultationSlots", source = "consultationSlots", qualifiedByName = "filterFutureSlots")
    TherapistDTO toDTO(Therapist therapist);

    @Named("filterFutureSlots")
    default List<LocalDate> filterFutureSlots(LocalDate[] slots) {
        if (slots == null) {
            return new ArrayList<>();
        }
        return Arrays.stream(slots)
                .filter(slot -> !slot.isBefore(LocalDate.now()))
                .sorted()
                .toList();
    }
}

