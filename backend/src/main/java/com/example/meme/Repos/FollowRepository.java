package com.example.meme.Repos;

import com.example.meme.Entities.Follow;
import com.example.meme.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FollowRepository extends JpaRepository<Follow, Long> {
    Optional<Follow> findByFollowerAndFollowing(User follower, User following);
    boolean existsByFollowerAndFollowing(User follower, User following);
    long countByFollower(User follower);
    long countByFollowing(User following);
}