package com.techblog.service;

import com.techblog.entity.Like;
import com.techblog.entity.Post;
import com.techblog.entity.User;
import com.techblog.repository.LikeRepository;
import com.techblog.repository.PostRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.techblog.service.NotificationService;
@Service
public class LikeService {

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private NotificationService notificationService;

    private static final String LIKED = "Liked";
    private static final String UNLIKED = "Unliked";

    // 🔁 TOGGLE LIKE
    @Transactional
    public String toggleLike(Integer postId, User user) {

        Post post = getPostById(postId);

        return likeRepository.findByUserAndPost(user, post)
                .map(existingLike -> {
                    likeRepository.delete(existingLike);
                    return UNLIKED;
                })
                .orElseGet(() -> {

                    Like like = Like.builder()
                            .user(user)
                            .post(post)
                            .build();

                    likeRepository.save(like);

                    // ================= NOTIFICATION =================

                    if (!post.getUser().getId().equals(user.getId())) {

                        notificationService.send(
                                post.getUser(),
                                user.getName() + " liked your post"
                        );
                    }

                    return LIKED;
                });
    }

    // ❤ GET LIKE COUNT
    public int getLikesCount(Integer postId) {
        Post post = getPostById(postId);
        return likeRepository.countByPost(post);
    }

    // ✅ NEW: CHECK IF USER LIKED POST
    public boolean isPostLikedByUser(Integer postId, User user) {

        Post post = getPostById(postId);

        return likeRepository.existsByUserAndPost(user, post);
    }

    // 🔒 COMMON METHOD (Reusable)
    private Post getPostById(Integer postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
    }
}