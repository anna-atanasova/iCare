package com.finki.icare.controller;

import com.finki.icare.config.JwtAuthenticationToken;
import com.finki.icare.dto.*;
import com.finki.icare.exceptions.ICareException;
import com.finki.icare.repository.PatientRepository;
import com.finki.icare.service.BlogService;
import com.finki.icare.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blogs")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class BlogController {

    private final BlogService blogService;
    private final CommentService commentService;
    private final PatientRepository patientRepository;

    private Integer getUserId(Authentication authentication) {
        if (authentication instanceof JwtAuthenticationToken jwtAuth) {
            return jwtAuth.getUserId();
        }
        throw ICareException.unauthorized("Authentication required");
    }

    @GetMapping
    public ResponseEntity<?> getAllBlogs(Authentication authentication) {
        try {
            Integer currentUserId = getUserId(authentication);

            List<BlogDTO> blogs = blogService.getAllBlogs(currentUserId);
            return ResponseEntity.ok(blogs);
        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBlogById(
            @PathVariable Integer id,
            Authentication authentication
    ) {
        try {
            Integer userId = getUserId(authentication);

            BlogDTO blog = blogService.getBlogById(id, userId);
            return ResponseEntity.ok(blog);
        } catch (ICareException e) {

            return ResponseEntity.status(e.getStatus())
                    .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("An error occurred"));
        }
    }

    @PostMapping
    public ResponseEntity<?> createBlog(
            @RequestBody CreateBlogRequest request,
            Authentication authentication
    ) {
        try {
            Integer userId = getUserId(authentication);
            BlogDTO createdBlog = blogService.createBlog(request, userId);

            return ResponseEntity.status(HttpStatus.CREATED).body(createdBlog);
        } catch (ICareException e) {

            return ResponseEntity.status(e.getStatus())
                    .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("An error occurred while creating the blog"));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBlog(
            @PathVariable Integer id,
            @RequestBody UpdateBlogRequest request,
            Authentication authentication
    ) {
        try {
            Integer userId = getUserId(authentication);
            BlogDTO updatedBlog = blogService.updateBlog(id, request, userId);

            return ResponseEntity.ok(updatedBlog);
        } catch (ICareException e) {

            return ResponseEntity.status(e.getStatus())
                    .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("An error occurred while updating the blog"));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBlog(
            @PathVariable Integer id,
            Authentication authentication
    ) {
        try {
            Integer userId = getUserId(authentication);
            blogService.deleteBlog(id, userId);

            return ResponseEntity.noContent().build();
        } catch (ICareException e) {

            return ResponseEntity.status(e.getStatus())
                    .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("An error occurred while deleting the blog"));
        }
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<?> toggleLike(
            @PathVariable Integer id,
            Authentication authentication
    ) {
        try {
            Integer userId = getUserId(authentication);
            blogService.toggleLike(id, userId);

            return ResponseEntity.ok().build();
        } catch (ICareException e) {

            return ResponseEntity.status(e.getStatus())
                    .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("An error occurred while toggling like"));
        }
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<?> addComment(
            @PathVariable Integer id,
            @RequestBody CreateCommentRequest request,
            Authentication authentication) {
        try {
            Integer userId = getUserId(authentication);
            CommentDTO comment = commentService.createComment(id, request, userId);

            return ResponseEntity.status(HttpStatus.CREATED).body(comment);
        } catch (ICareException e) {

            return ResponseEntity.status(e.getStatus())
                    .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("An error occurred while adding comment"));
        }
    }
}
