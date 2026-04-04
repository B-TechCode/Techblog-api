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

    // ✅ ADD COMMENT
    @PostMapping("/{postId}")
    public CommentResponse addComment(@PathVariable Integer postId,
                                      @RequestBody Comment comment,
                                      Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        comment.setUser(user);
        comment.setPost(post);

        return commentService.addComment(comment);
    }

    // ✅ GET COMMENTS
    @GetMapping("/{postId}")
    public List<CommentResponse> getComments(@PathVariable Integer postId) {
        return commentService.getCommentsByPost(postId);
    }
}