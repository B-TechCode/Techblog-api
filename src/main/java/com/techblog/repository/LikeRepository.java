package com.techblog.repository;

import com.techblog.entity.Like;
import com.techblog.entity.Post;
import com.techblog.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like, Integer> {

    Optional<Like> findByUserAndPost(User user, Post post);

    int countByPost(Post post);
}