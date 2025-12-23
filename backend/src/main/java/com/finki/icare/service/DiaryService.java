package com.finki.icare.service;

import com.finki.icare.dto.DiaryEntryDTO;
import com.finki.icare.exceptions.ICareException;
import com.finki.icare.model.Diary;
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

    public List<DiaryEntryDTO> getPatientDiaryEntriesForMonth(Integer patientId, int year, int month, Integer currentUserId, String userType) {
        if (!canAccessDiary(patientId, currentUserId, userType)) {
            throw ICareException.forbidden("You do not have permission to access this patient's diary");
        }

        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());

        List<Diary> diaries = diaryRepository.findByPatientIdAndDateRange(patientId, startDate, endDate);

        return diaries.stream()
                .map(this::mapToDiaryEntryDTO)
                .toList();
    }

    private boolean canAccessDiary(Integer patientId, Integer currentUserId, String userType) {
        if ("PATIENT".equals(userType) && patientId.equals(currentUserId)) {
            return true;
        }

        if ("THERAPIST".equals(userType)) {
            return patientRepository.isPatientAssignedToTherapist(patientId, currentUserId);
        }

        return false;
    }

    private DiaryEntryDTO mapToDiaryEntryDTO(Diary diary) {
        DiaryEntryDTO dto = new DiaryEntryDTO();
        dto.setIdDiary(diary.getIdDiary());
        dto.setDate(diary.getDate());
        dto.setDailyRating(diary.getDailyRating());
        dto.setContent(diary.getContent());
        return dto;
    }
}
