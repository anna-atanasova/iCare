package com.finki.icare.repository;

import com.finki.icare.model.Therapy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TherapyRepository extends JpaRepository<Therapy, Integer> {

    @Query("SELECT t FROM Therapy t WHERE t.consultation.idConsultation = :consultationId")
    List<Therapy> findByConsultationId(@Param("consultationId") Integer consultationId);
}

