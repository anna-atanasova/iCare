package com.finki.icare.service;

import com.finki.icare.dto.CreateDiaryEntryRequest;
import com.finki.icare.dto.DiaryEntryDTO;
import com.finki.icare.dto.UpdateDiaryEntryRequest;
import com.finki.icare.enums.UserType;
import com.finki.icare.exceptions.ICareException;
import com.finki.icare.mapper.DiaryMapper;
import com.finki.icare.model.Diary;
import com.finki.icare.model.Patient;
import com.finki.icare.repository.DiaryRepository;
import com.finki.icare.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DiaryService {

    private final DiaryRepository diaryRepository;
    private final PatientRepository patientRepository;
    private final DiaryMapper diaryMapper;

    public List<DiaryEntryDTO> getPatientDiaryEntriesForMonth(Integer patientId, int year, int month, Integer currentUserId, String userType) {
        if (!canAccessDiary(patientId, currentUserId, userType)) {
            throw ICareException.forbidden("You do not have permission to access this patient's diary");
        }

        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());

        List<Diary> diaries = diaryRepository.findByPatientIdAndDateRange(patientId, startDate, endDate);

        return diaries.stream()
                .map(diary -> {
                    DiaryEntryDTO dto = diaryMapper.toDTO(diary);
                    if (UserType.THERAPIST.equals(userType)) {
                        dto.setContent(null);
                    }
                    return dto;
                })
                .toList();
    }

    public DiaryEntryDTO createDiaryEntry(CreateDiaryEntryRequest request, Integer currentUserId, String userType) {
        if (!UserType.PATIENT.equals(userType)) {
            throw ICareException.forbidden("Only patients can create diary entries");
        }

        LocalDate today = LocalDate.now();
        if (diaryRepository.findByPatientIdAndDate(currentUserId, today).isPresent()) {
            throw ICareException.conflict("A diary entry already exists for this date");
        }

        if (request.getDailyRating() < 1 || request.getDailyRating() > 10) {
            throw ICareException.badRequest("Daily rating must be between 1 and 10");
        }

        Patient patient = patientRepository
                .findById(currentUserId)
                .orElseThrow(() -> ICareException.notFound("Patient not found"));

        Diary diary = new Diary();
        diary.setPatient(patient);
        diary.setDate(today);
        diary.setDailyRating(request.getDailyRating());
        diary.setContent(request.getContent());

        Diary savedDiary = diaryRepository.save(diary);
        return diaryMapper.toDTO(savedDiary);
    }

    public DiaryEntryDTO updateDiaryEntry(Integer diaryId, UpdateDiaryEntryRequest request, Integer currentUserId, String userType) {
        Diary diary = diaryRepository.findById(diaryId)
                .orElseThrow(() -> ICareException.notFound("Diary entry not found"));

        if (!canAccessDiary(diary.getPatient().getIdUser(), currentUserId, userType)) {
            throw ICareException.forbidden("You do not have permission to update this diary entry");
        }

        if (!UserType.PATIENT.equals(userType) || !diary.getPatient().getIdUser().equals(currentUserId)) {
            throw ICareException.forbidden("Only the owner of this diary entry can update it");
        }

        diary.setContent(request.getContent());

        if (request.getDailyRating() != null) {
            if (!diary.getDate().equals(LocalDate.now())) {
                throw ICareException.badRequest("Rating can only be changed for today's entry");
            }
            if (request.getDailyRating() < 1 || request.getDailyRating() > 10) {
                throw ICareException.badRequest("Daily rating must be between 1 and 10");
            }
            diary.setDailyRating(request.getDailyRating());
        }

        Diary updatedDiary = diaryRepository.save(diary);
        return diaryMapper.toDTO(updatedDiary);
    }

    public void deleteDiaryEntry(Integer diaryId, Integer currentUserId, String userType) {
        Diary diary = diaryRepository
                .findById(diaryId)
                .orElseThrow(() -> ICareException.notFound("Diary entry not found"));

        if (!diary.getDate().equals(LocalDate.now())) {
            throw ICareException.badRequest("You can only delete today's diary entry");
        }

        if (!UserType.PATIENT.equals(userType) || !diary.getPatient().getIdUser().equals(currentUserId)) {
            throw ICareException.forbidden("Only the patient who created the entry can delete it");
        }

        diaryRepository.delete(diary);
    }

    private boolean canAccessDiary(Integer patientId, Integer currentUserId, String userType) {
        if (UserType.PATIENT.equals(userType) && patientId.equals(currentUserId)) {
            return true;
        }

        if (UserType.THERAPIST.equals(userType)) {
            return patientRepository.isPatientAssignedToTherapist(patientId, currentUserId);
        }

        return false;
    }
}
