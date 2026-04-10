package com.techblog.service;

import com.techblog.dto.CommentResponse;
import com.techblog.entity.Comment;
import com.techblog.repository.CommentRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    // ✅ Add comment
    public CommentResponse addComment(Comment comment) {

        Comment savedComment = commentRepository.save(comment);

        return mapToDTO(savedComment);
    }

    // ✅ Get comments by post
    public List<CommentResponse> getCommentsByPost(Integer postId) {

        List<Comment> comments = commentRepository.findByPostId(postId);

        return comments.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ✅ GET COMMENT BY ID
    public Comment getCommentById(Integer id) {
        return commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
    }

    // ✅ DELETE COMMENT
    public void deleteComment(Integer id) {
        commentRepository.deleteById(id);
    }

    // ✅ COMMON MAPPER (SAFE)
    private CommentResponse mapToDTO(Comment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .userId(comment.getUser() != null ? comment.getUser().getId() : null)
                .userName(comment.getUser() != null ? comment.getUser().getName() : "Unknown")
                .userEmail(comment.getUser() != null ? comment.getUser().getEmail() : null)
                .createdAt(comment.getCreatedAt())
                .build();
    }
}