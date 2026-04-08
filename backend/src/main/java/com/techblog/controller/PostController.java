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
import org.springframework.web.multipart.MultipartFile;

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

    // ✅ CREATE POST
    @PostMapping
    public Post createPost(@RequestParam("title") String title,
                           @RequestParam("content") String content,
                           @RequestParam(value = "file", required = false) MultipartFile file,
                           Authentication authentication) throws Exception {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post post = new Post();
        post.setTitle(title);
        post.setContent(content);
        post.setUser(user);

        // 🔥 IMAGE UPLOAD
        if (file != null && !file.isEmpty()) {
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

            Path path = Paths.get("uploads/" + fileName);
            Files.createDirectories(path.getParent());
            Files.write(path, file.getBytes());

            post.setImage(fileName);
        }

        return postService.createPost(post);
    }

    // 🔥 UPDATED: UPDATE POST (WITH IMAGE)
    @PutMapping("/{id}")
    public Post updatePost(@PathVariable Integer id,
                           @RequestParam("title") String title,
                           @RequestParam("content") String content,
                           @RequestParam(value = "file", required = false) MultipartFile file,
                           Authentication authentication) throws Exception {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post existingPost = postService.getPostById(id);

        if (!existingPost.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You are not allowed to update this post");
        }

        existingPost.setTitle(title);
        existingPost.setContent(content);

        // 🔥 IMAGE UPDATE
        if (file != null && !file.isEmpty()) {

            // ❌ DELETE OLD IMAGE
            if (existingPost.getImage() != null) {
                Path oldPath = Paths.get("uploads/" + existingPost.getImage());
                Files.deleteIfExists(oldPath);
            }

            // ✅ SAVE NEW IMAGE
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

            Path path = Paths.get("uploads/" + fileName);
            Files.createDirectories(path.getParent());
            Files.write(path, file.getBytes());

            existingPost.setImage(fileName);
        }

        return postService.createPost(existingPost);
    }

    // 🔥 UPDATED: DELETE POST (WITH IMAGE DELETE)
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

        // 🔥 DELETE IMAGE
        if (post.getImage() != null) {
            Path path = Paths.get("uploads/" + post.getImage());
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