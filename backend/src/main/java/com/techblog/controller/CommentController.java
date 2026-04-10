package com.techblog.controller;

import com.techblog.dto.CommentResponse;
import com.techblog.entity.Comment;
import com.techblog.entity.Post;
import com.techblog.entity.User;
import com.techblog.repository.PostRepository;
import com.techblog.repository.UserRepository;
import com.techblog.service.CommentService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    // ✅ ADD COMMENT (FINAL FIX - CLEAN API)
    @PostMapping
    public CommentResponse addComment(@RequestBody Comment request,
                                      Authentication authentication) {

        String email = authentication.getName();

        // ✅ VALIDATION
        if (request.getContent() == null || request.getContent().trim().isEmpty()) {
            throw new RuntimeException("Comment cannot be empty");
        }

        if (request.getPost() == null || request.getPost().getId() == null) {
            throw new RuntimeException("Post ID is required");
        }

        // ✅ GET USER
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // ✅ GET POST
        Post post = postRepository.findById(request.getPost().getId())
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // ✅ CREATE COMMENT
        Comment comment = new Comment();
        comment.setContent(request.getContent().trim());
        comment.setUser(user);
        comment.setPost(post);

        return commentService.addComment(comment);
    }

    // ✅ GET COMMENTS BY POST
    @GetMapping("/{postId}")
    public List<CommentResponse> getComments(@PathVariable Integer postId) {
        return commentService.getCommentsByPost(postId);
    }

    // ✅ DELETE COMMENT (OWNER + ADMIN)
    @DeleteMapping("/{id}")
    public String deleteComment(@PathVariable Integer id,
                                Authentication authentication) {

        String email = authentication.getName();

        Comment comment = commentService.getCommentById(id);

        if (!comment.getUser().getEmail().equals(email)
                && !email.equals("admin@gmail.com")) {
            throw new RuntimeException("You are not allowed to delete this comment");
        }

        commentService.deleteComment(id);

        return "Comment deleted successfully!";
    }
}