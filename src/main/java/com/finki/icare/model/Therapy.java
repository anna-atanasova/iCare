package com.finki.icare.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "therapy", schema = "mental_health_app")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Therapy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_therapy")
    private Integer idTherapy;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "dose", nullable = false, length = 50)
    private String dose;

    @Column(name = "exp_date", nullable = false)
    private LocalDate expDate;

    @ManyToOne
    @JoinColumn(name = "id_consultation", nullable = false)
    private Consultation consultation;
}
