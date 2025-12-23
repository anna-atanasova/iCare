package com.finki.icare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TherapistDTO {
    private Integer idUser;
    private String name;
    private String surname;
    private String email;
    private String officeLocation;
    private String degree;
    private Integer yearsExp;
    private List<LocalDate> freeConsultationSlots;
}
