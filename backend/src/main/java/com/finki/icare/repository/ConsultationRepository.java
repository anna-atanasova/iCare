package com.finki.icare.repository;

import com.finki.icare.model.Consultation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConsultationRepository extends JpaRepository<Consultation, Integer> {

    @Query("SELECT c FROM Consultation c WHERE c.therapist.idUser = :therapistId ORDER BY c.date DESC")
    List<Consultation> findByTherapistId(@Param("therapistId") Integer therapistId);

    @Query("SELECT c FROM Consultation c WHERE c.patient.idUser = :patientId ORDER BY c.date DESC")
    List<Consultation> findByPatientId(@Param("patientId") Integer patientId);
}
