package com.techblog.service;

import com.techblog.entity.Like;
import com.techblog.entity.Post;
import com.techblog.entity.User;
import com.techblog.repository.LikeRepository;
import com.techblog.repository.PostRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LikeService {

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private PostRepository postRepository;

    public String toggleLike(Integer postId, User user) {

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // 🔍 Check if already liked
        return likeRepository.findByUserAndPost(user, post)
                .map(existingLike -> {
                    likeRepository.delete(existingLike);
                    return "Unliked";
                })
                .orElseGet(() -> {
                    Like like = new Like();
                    like.setUser(user);
                    like.setPost(post);
                    likeRepository.save(like);
                    return "Liked";
                });
    }

    public int getLikesCount(Integer postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        return likeRepository.countByPost(post);
    }
}