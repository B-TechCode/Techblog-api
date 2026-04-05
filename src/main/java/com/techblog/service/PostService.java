package com.techblog.service;

import com.techblog.entity.Post;
import com.techblog.repository.PostRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@Service
public class PostService {

    private static final Logger logger = LoggerFactory.getLogger(PostService.class);

    @Autowired
    private PostRepository postRepository;

    // ✅ CREATE POST
    public Post createPost(Post post) {
        logger.info("Creating post with title: {}", post.getTitle());

        Post savedPost = postRepository.save(post);

        logger.info("Post created successfully with id: {}", savedPost.getId());
        return savedPost;
    }

    // ✅ GET ALL POSTS
    public List<Post> getAllPosts() {
        logger.info("Fetching all posts");

        List<Post> posts = postRepository.findAll();

        logger.info("Total posts fetched: {}", posts.size());
        return posts;
    }

    // ✅ PAGINATION
    public Page<Post> getPosts(Pageable pageable) {
        logger.info("Fetching posts with pagination: page={}, size={}",
                pageable.getPageNumber(), pageable.getPageSize());

        return postRepository.findAll(pageable);
    }

    // ✅ GET POST BY ID
    public Post getPostById(Integer id) {
        logger.info("Fetching post with id: {}", id);

        return postRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Post not found with id: {}", id);
                    return new RuntimeException("Post not found with id: " + id);
                });
    }

    // ✅ UPDATE POST
    public Post updatePost(Integer id, Post updatedPost) {
        logger.info("Updating post with id: {}", id);

        Post existingPost = getPostById(id);

        existingPost.setTitle(updatedPost.getTitle());
        existingPost.setContent(updatedPost.getContent());

        Post savedPost = postRepository.save(existingPost);

        logger.info("Post updated successfully with id: {}", id);
        return savedPost;
    }

    // ✅ DELETE POST
    public void deletePost(Integer id) {
        logger.info("Deleting post with id: {}", id);

        Post post = getPostById(id);
        postRepository.delete(post);

        logger.info("Post deleted successfully with id: {}", id);
    }
}