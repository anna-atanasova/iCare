package com.finki.icare.repository;

import com.finki.icare.model.Diary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DiaryRepository extends JpaRepository<Diary, Integer> {

    @Query("SELECT d FROM Diary d WHERE d.patient.idUser = :patientId AND d.date >= :startDate AND d.date <= :endDate ORDER BY d.date")
    List<Diary> findByPatientIdAndDateRange(@Param("patientId") Integer patientId,
                                            @Param("startDate") LocalDate startDate,
                                            @Param("endDate") LocalDate endDate);

    @Query("SELECT d FROM Diary d WHERE d.patient.idUser = :patientId AND d.date = :date")
    Optional<Diary> findByPatientIdAndDate(@Param("patientId") Integer patientId,
                                            @Param("date") LocalDate date);
}
