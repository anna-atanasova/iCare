package com.finki.icare.mapper;

import com.finki.icare.dto.PatientDTO;
import com.finki.icare.model.Patient;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface PatientMapper {

    @Mapping(target = "userId", source = "idUser")
    @Mapping(target = "firstName", source = "name")
    @Mapping(target = "lastName", source = "surname")
    @Mapping(target = "email", source = "email")
    PatientDTO toDTO(Patient patient);
}
