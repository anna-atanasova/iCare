package com.finki.icare.mapper;

import com.finki.icare.dto.CommentDTO;
import com.finki.icare.model.Comment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface CommentMapper {

    @Mapping(target = "idComment", source = "idComment")
    @Mapping(target = "content", source = "content")
    @Mapping(target = "dateOfComment", source = "dateOfComment")
    @Mapping(target = "patientId", source = "patient.idUser")
    @Mapping(target = "patientUsername", source = "patient.username")
    @Mapping(target = "patientName", expression = "java(comment.getPatient().getName() + \" \" + comment.getPatient().getSurname())")
    CommentDTO toDTO(Comment comment);
}

