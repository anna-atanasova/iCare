package com.finki.icare.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(
    name = "diary",
    schema = "mental_health_app",
    uniqueConstraints = @UniqueConstraint(columnNames = {"id_patient", "date"})
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Diary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_diary")
    private Integer idDiary;

    @ManyToOne
    @JoinColumn(name = "id_patient", nullable = false)
    private Patient patient;

    @Column(name = "date", nullable = false)
    private LocalDate date;

    @Column(name = "daily_rating", nullable = false)
    private Short dailyRating;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;
}
