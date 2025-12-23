package com.finki.icare.controller;

import com.finki.icare.config.JwtAuthenticationToken;
import com.finki.icare.dto.DiaryEntryDTO;
import com.finki.icare.exceptions.ICareException;
import com.finki.icare.service.DiaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/diary")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class DiaryController {

    private final DiaryService diaryService;

    private Integer getUserId(Authentication authentication) {
        if (authentication instanceof JwtAuthenticationToken jwtAuth) {
            return jwtAuth.getUserId();
        }
        throw ICareException.unauthorized("Authentication required");
    }

    private String getUserType(Authentication authentication) {
        if (authentication instanceof JwtAuthenticationToken jwtAuth) {
            return jwtAuth.getUserType();
        }
        throw ICareException.unauthorized("Authentication required");
    }

    @GetMapping("/{patientId}")
    public ResponseEntity<List<DiaryEntryDTO>> getPatientDiaryEntries(
            @PathVariable Integer patientId,
            @RequestParam int year,
            @RequestParam int month,
            Authentication authentication
    ) {
        Integer currentUserId = getUserId(authentication);
        String userType = getUserType(authentication);

        List<DiaryEntryDTO> entries = diaryService.getPatientDiaryEntriesForMonth(
                patientId, year, month, currentUserId, userType
        );
        return ResponseEntity.ok(entries);
    }
}
