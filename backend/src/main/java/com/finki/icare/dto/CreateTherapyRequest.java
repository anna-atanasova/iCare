package com.finki.icare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateTherapyRequest {
    private String name;
    private String dose;
    private LocalDate expDate;
}
