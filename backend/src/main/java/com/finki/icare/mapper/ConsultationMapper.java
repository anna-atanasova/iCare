package com.finki.icare.mapper;

import com.finki.icare.dto.ConsultationDTO;
import com.finki.icare.model.Consultation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, uses = {TherapyMapper.class})
public interface ConsultationMapper {

    @Mapping(target = "idConsultation", source = "idConsultation")
    @Mapping(target = "patientId", source = "patient.idUser")
    @Mapping(target = "patientName", expression = "java(consultation.getPatient().getName() + \" \" + consultation.getPatient().getSurname())")
    @Mapping(target = "therapistId", source = "therapist.idUser")
    @Mapping(target = "therapistName", expression = "java(consultation.getTherapist().getName() + \" \" + consultation.getTherapist().getSurname())")
    @Mapping(target = "date", source = "date")
    @Mapping(target = "dateOfPayment", source = "dateOfPayment")
    @Mapping(target = "price", source = "price")
    @Mapping(target = "advice", source = "advice")
    @Mapping(target = "therapies", source = "therapies")
    ConsultationDTO toDTO(Consultation consultation);
}
