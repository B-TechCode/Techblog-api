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

    // ✅ ADD COMMENT (FIXED SAFE VERSION)
    @PostMapping("/{postId}")
    public CommentResponse addComment(@PathVariable Integer postId,
                                      @RequestBody Comment request,
                                      Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // 🔥 CREATE NEW COMMENT (IMPORTANT FIX)
        Comment comment = new Comment();
        comment.setContent(request.getContent());
        comment.setUser(user);
        comment.setPost(post);

        return commentService.addComment(comment);
    }

    // ✅ GET COMMENTS
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