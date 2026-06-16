package com.techblog.repository;

import com.techblog.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Integer> {

    // 🔥 Get comments by post (latest first)
    List<Comment> findByPostIdOrderByCreatedAtDesc(Integer postId);

    // 🔧 Optional (for future optimization)
    void deleteById(Integer id);
}