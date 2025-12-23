package com.finki.icare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentDTO {
    private Integer idComment;
    private String content;
    private OffsetDateTime dateOfComment;
    private Integer patientId;
    private String patientUsername;
    private String patientName;
}
