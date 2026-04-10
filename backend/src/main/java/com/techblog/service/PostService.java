package com.techblog.service;

import com.techblog.entity.Post;
import com.techblog.repository.PostRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    // ✅ CREATE / UPDATE POST (same method used)
    public Post createPost(Post post) {
        return postRepository.save(post);
    }

    // ✅ GET ALL POSTS
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    // ✅ PAGINATION
    public Page<Post> getPosts(Pageable pageable) {
        return postRepository.findAll(pageable);
    }

    // ✅ GET POST BY ID
    public Post getPostById(Integer id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
    }

    // ✅ UPDATE POST (kept for consistency but not used in controller)
    public Post updatePost(Integer id, Post updatedPost) {
        Post existingPost = getPostById(id);

        existingPost.setTitle(updatedPost.getTitle());
        existingPost.setContent(updatedPost.getContent());

        return postRepository.save(existingPost);
    }

    // ✅ DELETE POST
    public void deletePost(Integer id) {
        Post post = getPostById(id);
        postRepository.delete(post);
    }

    // ✅ GET POSTS BY USER
    public List<Post> getPostsByUser(String email) {
        return postRepository.findByUserEmail(email);
    }
}