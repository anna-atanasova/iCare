package com.finki.icare.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "therapist")
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

    @Column(name = "phone_number", nullable = false, length = 20)
    private String phoneNumber;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "consultation_slots", columnDefinition = "DATE[]")
    private LocalDate[] consultationSlots;

    @JsonIgnore
    @OneToMany(mappedBy = "therapist", cascade = CascadeType.ALL)
    private List<Patient> patients;

    @JsonIgnore
    @OneToMany(mappedBy = "therapist", cascade = CascadeType.ALL)
    private List<Consultation> consultations;
}
