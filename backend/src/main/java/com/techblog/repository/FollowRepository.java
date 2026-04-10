package com.techblog.repository;

import com.techblog.entity.Follow;
import com.techblog.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FollowRepository extends JpaRepository<Follow, Integer> {

    Optional<Follow> findByFollowerAndFollowing(User follower, User following);

    int countByFollowing(User user);

    int countByFollower(User user);
}