package com.finki.icare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DiaryEntryDTO {
    private Integer idDiary;
    private LocalDate date;
    private Short dailyRating;
    private String content;
}
