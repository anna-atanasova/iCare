package com.finki.icare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BlogDTO {
    private Integer idBlog;
    private String title;
    private String content;
    private OffsetDateTime dateOfPost;
    private Integer patientId;
    private String patientUsername;
    private String patientName;
    private Integer likesCount;
    private Integer commentsCount;
    private boolean likedByCurrentUser;
    private List<CommentDTO> comments;
}
