package com.finki.icare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateConsultationRequest {
    private LocalDate date;
    private BigDecimal price;
    private String advice;
    private LocalDate dateOfPayment; // nullable - if set, means paid
}
