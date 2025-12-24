package com.finki.icare.mapper;

import com.finki.icare.dto.DiaryEntryDTO;
import com.finki.icare.model.Diary;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface DiaryMapper {

    @Mapping(target = "idDiary", source = "idDiary")
    @Mapping(target = "date", source = "date")
    @Mapping(target = "dailyRating", source = "dailyRating")
    @Mapping(target = "content", source = "content")
    DiaryEntryDTO toDTO(Diary diary);
}
