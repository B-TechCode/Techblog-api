package com.techblog.controller;

import com.techblog.dto.CommentResponse;
import com.techblog.entity.Comment;
import com.techblog.entity.Post;
import com.techblog.entity.User;
import com.techblog.repository.PostRepository;
import com.techblog.repository.UserRepository;
import com.techblog.service.CommentService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    // ================= ADD COMMENT =================

    @PostMapping
    public ResponseEntity<?> addComment(
            @RequestBody Map<String, Object> request,
            Authentication authentication
    ) {

        try {

            String email = authentication.getName();

            // ✅ GET CONTENT
            String content =
                    (String) request.get("content");

            // ✅ GET POST ID
            Integer postId =
                    (Integer) request.get("postId");

            // ✅ EMPTY CHECK
            if (content == null
                    || content.trim().isEmpty()) {

                throw new RuntimeException(
                        "Comment cannot be empty"
                );
            }

            // ✅ POST ID CHECK
            if (postId == null) {

                throw new RuntimeException(
                        "Post ID is required"
                );
            }

            User user = userRepository.findByEmail(email)
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "User not found"
                            ));

            Post post = postRepository.findById(postId)
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Post not found"
                            ));

            // ✅ CREATE COMMENT
            Comment comment = new Comment();

            comment.setContent(content.trim());

            comment.setUser(user);

            comment.setPost(post);

            CommentResponse response =
                    commentService.addComment(comment);

            return ResponseEntity.ok(response);

        } catch (Exception e) {

            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

    // ================= GET COMMENTS =================

    @GetMapping("/{postId}")
    public ResponseEntity<?> getComments(
            @PathVariable Integer postId
    ) {

        try {

            List<CommentResponse> comments =
                    commentService.getCommentsByPost(postId);

            return ResponseEntity.ok(comments);

        } catch (Exception e) {

            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

    // ================= DELETE COMMENT =================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComment(
            @PathVariable Integer id,
            Authentication authentication
    ) {

        try {

            String email = authentication.getName();

            Comment comment =
                    commentService.getCommentById(id);

            // ✅ OWNER OR ADMIN
            if (!comment.getUser().getEmail().equals(email)
                    && !email.equals("admin@gmail.com")) {

                throw new RuntimeException(
                        "You are not allowed to delete this comment"
                );
            }

            commentService.deleteComment(id);

            return ResponseEntity.ok(
                    "Comment deleted successfully!"
            );

        } catch (Exception e) {

            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

    // ================= UPDATE COMMENT =================

    @PutMapping("/{id}")
    public ResponseEntity<?> updateComment(
            @PathVariable Integer id,
            @RequestBody Map<String, String> request,
            Authentication authentication
    ) {

        try {

            String email = authentication.getName();

            Comment comment =
                    commentService.getCommentById(id);

            // ✅ OWNER CHECK
            if (!comment.getUser().getEmail().equals(email)) {

                throw new RuntimeException(
                        "You are not allowed to edit this comment"
                );
            }

            String content =
                    request.get("content");

            CommentResponse updated =
                    commentService.updateComment(
                            id,
                            content
                    );

            return ResponseEntity.ok(updated);

        } catch (Exception e) {

            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }
}