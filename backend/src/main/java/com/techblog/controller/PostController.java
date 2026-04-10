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

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @Autowired
    private UserRepository userRepository;

    // 🔥 IMAGE PATH
    private final String UPLOAD_DIR = "D:/Techblog/techblog/uploads/";

    // ✅ GET ALL POSTS
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

    // 🔥🔥🔥 FINAL FIXED CREATE POST (JSON BASED)
    @PostMapping
    public Post createPost(@RequestBody Post post,
                           Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // ✅ IMPORTANT
        post.setUser(user);

        // ✅ prevent null image issue
        if (post.getImage() == null) {
            post.setImage("");
        }

        return postService.createPost(post);
    }

    // 🔥 UPDATE POST (JSON BASED)
    @PutMapping("/{id}")
    public Post updatePost(@PathVariable Integer id,
                           @RequestBody Post updatedPost,
                           Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post existingPost = postService.getPostById(id);

        // ✅ SECURITY CHECK
        if (!existingPost.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You are not allowed to update this post");
        }

        existingPost.setTitle(updatedPost.getTitle());
        existingPost.setContent(updatedPost.getContent());

        // ✅ OPTIONAL IMAGE UPDATE
        if (updatedPost.getImage() != null) {
            existingPost.setImage(updatedPost.getImage());
        }

        return postService.createPost(existingPost);
    }

    // 🔥 DELETE POST
    @DeleteMapping("/{id}")
    public String deletePost(@PathVariable Integer id,
                             Authentication authentication) throws Exception {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post post = postService.getPostById(id);

        if (!post.getUser().getId().equals(user.getId())
                && !email.equals("admin@gmail.com")) {
            throw new RuntimeException("You are not allowed to delete this post");
        }

        // ✅ DELETE IMAGE FILE
        if (post.getImage() != null && !post.getImage().isEmpty()) {
            Path path = Paths.get(UPLOAD_DIR + post.getImage());
            Files.deleteIfExists(path);
        }

        postService.deletePost(id);

        return "Post deleted successfully!";
    }

    // ✅ MY POSTS
    @GetMapping("/my")
    public List<Post> getMyPosts(Authentication authentication) {
        String email = authentication.getName();
        return postService.getPostsByUser(email);
    }
}