package com.finki.icare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateConsultationRequest {
    private Integer patientId;
    private LocalDate date;
    private BigDecimal price;
    private String advice;
    private LocalDate dateOfPayment; // nullable - if set, means paid
    private List<CreateTherapyRequest> therapies;
}
