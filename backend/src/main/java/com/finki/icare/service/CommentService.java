package com.finki.icare.service;

import com.finki.icare.dto.CommentDTO;
import com.finki.icare.dto.CreateCommentRequest;
import com.finki.icare.exceptions.ICareException;
import com.finki.icare.model.Blog;
import com.finki.icare.model.Comment;
import com.finki.icare.model.Patient;
import com.finki.icare.repository.BlogRepository;
import com.finki.icare.repository.CommentRepository;
import com.finki.icare.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final BlogRepository blogRepository;
    private final PatientRepository patientRepository;

    @Transactional
    public CommentDTO createComment(Integer blogId, CreateCommentRequest request, Integer patientId) {
        Blog blog = blogRepository
                .findById(blogId)
                .orElseThrow(() -> ICareException.notFound("Blog not found with id: " + blogId));

        Patient patient = patientRepository
                .findById(patientId)
                .orElseThrow(() -> ICareException.unauthorized("Only patients can comment"));

        Comment comment = new Comment();
        comment.setBlog(blog);
        comment.setPatient(patient);
        comment.setContent(request.getContent());
        comment.setDateOfComment(OffsetDateTime.now());

        Comment savedComment = commentRepository.save(comment);
        return convertToDTO(savedComment);
    }

    @Transactional
    public CommentDTO updateComment(Integer commentId, String content, Integer patientId) {
        Comment comment = commentRepository
                .findById(commentId)
                .orElseThrow(() -> ICareException.notFound("Comment not found with id: " + commentId));

        if (!comment.getPatient().getIdUser().equals(patientId)) {
            throw ICareException.forbidden("You are not authorized to update this comment");
        }

        comment.setContent(content);
        Comment updatedComment = commentRepository.save(comment);
        return convertToDTO(updatedComment);
    }

    @Transactional
    public void deleteComment(Integer commentId, Integer patientId) {
        Comment comment = commentRepository
                .findById(commentId)
                .orElseThrow(() -> ICareException.notFound("Comment not found with id: " + commentId));

        if (!comment.getPatient().getIdUser().equals(patientId)) {
            throw ICareException.forbidden("You are not authorized to delete this comment");
        }

        commentRepository.delete(comment);
    }

    public CommentDTO convertToDTO(Comment comment) {
        CommentDTO dto = new CommentDTO();
        dto.setIdComment(comment.getIdComment());
        dto.setContent(comment.getContent());
        dto.setDateOfComment(comment.getDateOfComment());
        dto.setPatientId(comment.getPatient().getIdUser());
        dto.setPatientUsername(comment.getPatient().getUsername());
        dto.setPatientName(comment.getPatient().getName() + " " + comment.getPatient().getSurname());

        return dto;
    }
}
