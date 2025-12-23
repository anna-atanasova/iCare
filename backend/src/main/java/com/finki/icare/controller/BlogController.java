package com.finki.icare.controller;

import com.finki.icare.config.JwtAuthenticationToken;
import com.finki.icare.dto.*;
import com.finki.icare.exceptions.ICareException;
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

    private Integer getUserId(Authentication authentication) {
        if (authentication instanceof JwtAuthenticationToken jwtAuth) {
            return jwtAuth.getUserId();
        }
        throw ICareException.unauthorized("Authentication required");
    }

    @GetMapping
    public ResponseEntity<List<BlogDTO>> getAllBlogs(Authentication authentication) {
        Integer currentUserId = getUserId(authentication);
        List<BlogDTO> blogs = blogService.getAllBlogs(currentUserId);
        return ResponseEntity.ok(blogs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BlogDTO> getBlogById(
            @PathVariable Integer id,
            Authentication authentication
    ) {

        Integer userId = getUserId(authentication);
        BlogDTO blog = blogService.getBlogById(id, userId);
        return ResponseEntity.ok(blog);
    }

    @PostMapping
    public ResponseEntity<BlogDTO> createBlog(
            @RequestBody CreateBlogRequest request,
            Authentication authentication
    ) {

        Integer userId = getUserId(authentication);
        BlogDTO createdBlog = blogService.createBlog(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdBlog);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BlogDTO> updateBlog(
            @PathVariable Integer id,
            @RequestBody UpdateBlogRequest request,
            Authentication authentication
    ) {

        Integer userId = getUserId(authentication);
        BlogDTO updatedBlog = blogService.updateBlog(id, request, userId);
        return ResponseEntity.ok(updatedBlog);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBlog(
            @PathVariable Integer id,
            Authentication authentication
    ) {

        Integer userId = getUserId(authentication);
        blogService.deleteBlog(id, userId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<Void> toggleLike(
            @PathVariable Integer id,
            Authentication authentication
    ) {

        Integer userId = getUserId(authentication);
        blogService.toggleLike(id, userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<CommentDTO> addComment(
            @PathVariable Integer id,
            @RequestBody CreateCommentRequest request,
            Authentication authentication
    ) {

        Integer userId = getUserId(authentication);
        CommentDTO comment = commentService.createComment(id, request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(comment);
    }

    @PutMapping("/comments/{commentId}")
    public ResponseEntity<CommentDTO> updateComment(
            @PathVariable Integer commentId,
            @RequestBody CreateCommentRequest request,
            Authentication authentication
    ) {
        Integer userId = getUserId(authentication);
        CommentDTO updatedComment = commentService.updateComment(commentId, request.getContent(), userId);
        return ResponseEntity.ok(updatedComment);
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Integer commentId,
            Authentication authentication
    ) {
        Integer userId = getUserId(authentication);
        commentService.deleteComment(commentId, userId);
        return ResponseEntity.noContent().build();
    }
}
