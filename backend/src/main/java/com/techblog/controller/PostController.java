package com.techblog.controller;

import com.techblog.entity.Post;
import com.techblog.entity.User;
import com.techblog.repository.UserRepository;
import com.techblog.service.PostService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @Autowired
    private UserRepository userRepository;

    // ✅ GET ALL POSTS (simple)
    @GetMapping
    public List<Post> getAllPosts() {
        return postService.getAllPosts();
    }

    // ✅ PAGINATION
    @GetMapping("/all")
    public Page<Post> getPosts(Pageable pageable) {
        return postService.getPosts(pageable);
    }

    // ✅ GET POST BY ID
    @GetMapping("/{id}")
    public Post getPostById(@PathVariable Integer id) {
        return postService.getPostById(id);
    }

    // ✅ CREATE POST (JWT user attach)
    @PostMapping
    public Post createPost(@RequestBody Post post, Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        post.setUser(user);

        return postService.createPost(post);
    }

    // ✅ UPDATE POST (ONLY OWNER)
    @PutMapping("/{id}")
    public Post updatePost(@PathVariable Integer id,
                           @RequestBody Post post,
                           Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post existingPost = postService.getPostById(id);

        // 🔐 OWNER CHECK
        if (!existingPost.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You are not allowed to update this post");
        }

        return postService.updatePost(id, post);
    }

    // ✅ DELETE POST (ONLY OWNER)
    @DeleteMapping("/{id}")
    public String deletePost(@PathVariable Integer id,
                             Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post existingPost = postService.getPostById(id);

        // 🔐 OWNER CHECK
        if (!existingPost.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You are not allowed to delete this post");
        }

        postService.deletePost(id);

        return "Post deleted successfully!";
    }
}