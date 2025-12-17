package com.finki.icare.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "therapist", schema = "mental_health_app")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@PrimaryKeyJoinColumn(name = "id_user")
public class Therapist extends User {

    @Column(name = "office_location", nullable = false, length = 255)
    private String officeLocation;

    @Column(name = "degree", nullable = false, length = 100)
    private String degree;

    @Column(name = "years_exp", nullable = false)
    private Integer yearsExp;

    @OneToMany(mappedBy = "therapist", cascade = CascadeType.ALL)
    private List<Patient> patients;

    @OneToMany(mappedBy = "therapist", cascade = CascadeType.ALL)
    private List<Consultation> consultations;
}
