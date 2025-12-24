package com.finki.icare.service;

import com.finki.icare.dto.BlogDTO;
import com.finki.icare.dto.CreateBlogRequest;
import com.finki.icare.dto.UpdateBlogRequest;
import com.finki.icare.exceptions.ICareException;
import com.finki.icare.mapper.BlogMapper;
import com.finki.icare.mapper.CommentMapper;
import com.finki.icare.model.Blog;
import com.finki.icare.model.Patient;
import com.finki.icare.repository.BlogRepository;
import com.finki.icare.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BlogService {

    private final BlogRepository blogRepository;
    private final PatientRepository patientRepository;
    private final BlogMapper blogMapper;
    private final CommentMapper commentMapper;

    @Transactional(readOnly = true)
    public List<BlogDTO> getAllBlogs(Integer patientId) {
        getPatient(patientId);

        return blogRepository
                .findAllByOrderByDateOfPostDesc()
                .stream()
                .map(blog -> blogMapper.toDTO(blog, patientId, false, commentMapper))
                .toList();
    }

    @Transactional(readOnly = true)
    public BlogDTO getBlogById(Integer blogId, Integer patientId) {
        getPatient(patientId);
        Blog blog = getBlog(blogId);

        return blogMapper.toDTO(blog, patientId, true, commentMapper);
    }

    @Transactional
    public BlogDTO createBlog(CreateBlogRequest request, Integer patientId) {
        Patient patient = getPatient(patientId);

        Blog blog = new Blog();
        blog.setTitle(request.getTitle());
        blog.setContent(request.getContent());
        blog.setPatient(patient);
        blog.setDateOfPost(OffsetDateTime.now());

        Blog savedBlog = blogRepository.save(blog);
        return blogMapper.toDTO(savedBlog, patientId, false, commentMapper);
    }

    @Transactional
    public BlogDTO updateBlog(Integer blogId, UpdateBlogRequest request, Integer patientId) {
        Blog blog = getBlog(blogId);

        if (!blog.getPatient().getIdUser().equals(patientId)) {
            throw ICareException.forbidden("You are not authorized to update this blog");
        }

        blog.setTitle(request.getTitle());
        blog.setContent(request.getContent());

        Blog updatedBlog = blogRepository.save(blog);
        return blogMapper.toDTO(updatedBlog, patientId, true, commentMapper);
    }

    @Transactional
    public void deleteBlog(Integer blogId, Integer patientId) {
        Blog blog = getBlog(blogId);

        if (!blog.getPatient().getIdUser().equals(patientId)) {
            throw ICareException.forbidden("You are not authorized to delete this blog");
        }

        blogRepository.delete(blog);
    }

    @Transactional
    public void toggleLike(Integer blogId, Integer patientId) {
        Blog blog = getBlog(blogId);
        Patient patient = getPatient(patientId);

        if (patient.getLikedBlogs() == null) {
            patient.setLikedBlogs(new java.util.ArrayList<>());
        }

        boolean alreadyLiked = patient
                .getLikedBlogs()
                .stream()
                .anyMatch(b -> b.getIdBlog().equals(blogId));

        if (alreadyLiked) {
            patient.getLikedBlogs().removeIf(b -> b.getIdBlog().equals(blogId));
        } else {
            patient.getLikedBlogs().add(blog);
        }

        patientRepository.save(patient);
    }

    private Patient getPatient(Integer patientId) {
        return patientRepository
                .findById(patientId)
                .orElseThrow(() -> ICareException.forbidden("Only patients can access blogs"));
    }

    private Blog getBlog(Integer blogId) {
        return blogRepository
                .findById(blogId)
                .orElseThrow(() -> ICareException.notFound("Blog not found with id: " + blogId));
    }
}
