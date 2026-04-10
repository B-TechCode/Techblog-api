package com.techblog.service;

import com.techblog.entity.Follow;
import com.techblog.entity.User;
import com.techblog.repository.FollowRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FollowService {

    @Autowired
    private FollowRepository followRepository;

    public String toggleFollow(User follower, User following) {

        return followRepository.findByFollowerAndFollowing(follower, following)
                .map(follow -> {
                    followRepository.delete(follow);
                    return "Unfollowed";
                })
                .orElseGet(() -> {
                    Follow f = new Follow();
                    f.setFollower(follower);
                    f.setFollowing(following);
                    followRepository.save(f);
                    return "Followed";
                });
    }
}