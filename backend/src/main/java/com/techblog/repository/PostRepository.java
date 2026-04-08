package com.techblog.repository;
import java.util.List;
import com.techblog.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Integer> {
    // ✅ ADD THIS METHOD
    List<Post> findByUserEmail(String email);
}


