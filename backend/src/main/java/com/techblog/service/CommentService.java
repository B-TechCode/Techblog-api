package com.techblog.service;

import com.techblog.dto.CommentResponse;
import com.techblog.entity.Comment;
import com.techblog.repository.CommentRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import com.techblog.service.NotificationService;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private NotificationService notificationService;

    // ✅ Add comment
    public CommentResponse addComment(Comment comment) {

        Comment savedComment = commentRepository.save(comment);

// ================= NOTIFICATION =================

        if (savedComment.getPost() != null
                && savedComment.getPost().getUser() != null
                && !savedComment.getPost().getUser().getId()
                .equals(savedComment.getUser().getId())) {

            notificationService.send(
                    savedComment.getPost().getUser(),
                    savedComment.getUser().getName() + " commented on your post"
            );
        }

        return mapToDTO(savedComment);
    }

    // ✅ Get comments by post (LATEST FIRST)
    public List<CommentResponse> getCommentsByPost(Integer postId) {

        List<Comment> comments = commentRepository.findByPostIdOrderByCreatedAtDesc(postId);

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

    // ✅ UPDATE COMMENT (EDIT FEATURE)
    public CommentResponse updateComment(Integer id, String content) {

        Comment comment = getCommentById(id);

        if (content == null || content.trim().isEmpty()) {
            throw new RuntimeException("Comment cannot be empty");
        }

        comment.setContent(content.trim());

        Comment updated = commentRepository.save(comment);

        return mapToDTO(updated);
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