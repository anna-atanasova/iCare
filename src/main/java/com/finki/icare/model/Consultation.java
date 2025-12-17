package com.finki.icare.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "consultation", schema = "mental_health_app")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Consultation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_consultation")
    private Integer idConsultation;

    @ManyToOne
    @JoinColumn(name = "id_patient", nullable = false)
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "id_therapist", nullable = false)
    private Therapist therapist;

    @Column(name = "date", nullable = false)
    private LocalDate date;

    @Column(name = "date_of_payment")
    private LocalDate dateOfPayment;

    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "advice", columnDefinition = "TEXT")
    private String advice;

    @JsonIgnore
    @OneToMany(mappedBy = "consultation", cascade = CascadeType.ALL)
    private List<Therapy> therapies;
}
