package com.finki.icare.mapper;

import com.finki.icare.dto.TherapyDTO;
import com.finki.icare.model.Therapy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface TherapyMapper {

    @Mapping(target = "idTherapy", source = "idTherapy")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "dose", source = "dose")
    @Mapping(target = "expDate", source = "expDate")
    @Mapping(target = "consultationId", source = "consultation.idConsultation")
    TherapyDTO toDTO(Therapy therapy);
}
