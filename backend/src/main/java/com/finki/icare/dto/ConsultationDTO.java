package com.finki.icare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConsultationDTO {
    private Integer idConsultation;
    private Integer patientId;
    private String patientName;
    private Integer therapistId;
    private String therapistName;
    private LocalDate date;
    private LocalDate dateOfPayment;
    private BigDecimal price;
    private String advice;
}
