package com.finki.icare.repository;

import com.finki.icare.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Integer> {

    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END FROM Patient p WHERE p.idUser = :patientId AND p.therapist.idUser = :therapistId")
    boolean isPatientAssignedToTherapist(@Param("patientId") Integer patientId, @Param("therapistId") Integer therapistId);

    @Query("SELECT p FROM Patient p WHERE p.therapist.idUser = :therapistId")
    List<Patient> findPatientsByTherapistId(@Param("therapistId") Integer therapistId);
}
