package com.finki.icare.mapper;

import com.finki.icare.dto.BlogDTO;
import com.finki.icare.dto.CommentDTO;
import com.finki.icare.model.Blog;
import org.mapstruct.*;

import java.util.ArrayList;
import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, uses = CommentMapper.class)
public interface BlogMapper {

    @Mapping(target = "idBlog", source = "blog.idBlog")
    @Mapping(target = "title", source = "blog.title")
    @Mapping(target = "content", expression = "java(includeFullData ? blog.getContent() : null)")
    @Mapping(target = "dateOfPost", source = "blog.dateOfPost")
    @Mapping(target = "patientId", source = "blog.patient.idUser")
    @Mapping(target = "patientUsername", source = "blog.patient.username")
    @Mapping(target = "patientName", expression = "java(blog.getPatient().getName() + \" \" + blog.getPatient().getSurname())")
    @Mapping(target = "likesCount", expression = "java(blog.getLikedBy() != null ? blog.getLikedBy().size() : 0)")
    @Mapping(target = "commentsCount", expression = "java(blog.getComments() != null ? blog.getComments().size() : 0)")
    @Mapping(target = "likedByCurrentUser", expression = "java(isLikedByCurrentUser(blog, currentUserId))")
    @Mapping(target = "comments", expression = "java(mapComments(blog, includeFullData, commentMapper))")
    BlogDTO toDTO(Blog blog, @Context Integer currentUserId, @Context Boolean includeFullData, @Context CommentMapper commentMapper);

    default boolean isLikedByCurrentUser(Blog blog, Integer currentUserId) {
        return currentUserId != null &&
                blog.getLikedBy() != null &&
                blog.getLikedBy()
                        .stream()
                        .anyMatch(patient -> patient.getIdUser().equals(currentUserId));
    }

    default List<CommentDTO> mapComments(Blog blog, boolean includeFullData, CommentMapper commentMapper) {
        if (!includeFullData || blog.getComments() == null) {
            return new ArrayList<>();
        }

        return blog.getComments()
                .stream()
                .map(commentMapper::toDTO)
                .toList();
    }
}

