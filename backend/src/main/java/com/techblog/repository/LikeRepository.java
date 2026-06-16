package com.techblog.repository;

import com.techblog.entity.Like;
import com.techblog.entity.Post;
import com.techblog.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like, Integer> {

    // 🔍 Find existing like
    Optional<Like> findByUserAndPost(User user, Post post);

    // ❤ Count likes for a post
    int countByPost(Post post);

    // ✅ Check if user already liked (useful for frontend)
    boolean existsByUserAndPost(User user, Post post);

    // ❌ Optional optimization (not used yet, but industry practice)
    void deleteByUserAndPost(User user, Post post);
}