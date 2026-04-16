package com.example.meme.Controllers;

import com.example.meme.Entities.Follow;
import com.example.meme.Entities.User;
import com.example.meme.Repos.FollowRepository;
import com.example.meme.Repos.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/follows")
public class FollowController {

    private final FollowRepository followRepository;
    private final UserRepository userRepository;

    public FollowController(FollowRepository followRepository, UserRepository userRepository) {
        this.followRepository = followRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/status")
    public ResponseEntity<?> getFollowStatus(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam Long userId
    ) {
        Map<String, Object> response = new HashMap<>();

        User targetUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("대상 유저를 찾을 수 없습니다."));

        response.put("followers", followRepository.countByFollowing(targetUser));
        response.put("following", followRepository.countByFollower(targetUser));

        if (jwt == null) {
            response.put("followingStatus", false);
            return ResponseEntity.ok(response);
        }

        String auth0Id = jwt.getSubject();

        User me = userRepository.findByAuth0Id(auth0Id)
                .orElseThrow(() -> new RuntimeException("로그인 유저를 찾을 수 없습니다."));

        boolean followingStatus = followRepository.existsByFollowerAndFollowing(me, targetUser);
        response.put("followingStatus", followingStatus);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/toggle")
    public ResponseEntity<?> toggleFollow(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam Long userId
    ) {
        String auth0Id = jwt.getSubject();

        User me = userRepository.findByAuth0Id(auth0Id)
                .orElseThrow(() -> new RuntimeException("로그인 유저를 찾을 수 없습니다."));

        User targetUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("대상 유저를 찾을 수 없습니다."));

        if (me.getId().equals(targetUser.getId())) {
            return ResponseEntity.badRequest().body("자기 자신은 팔로우할 수 없습니다.");
        }

        boolean currentlyFollowing = followRepository.existsByFollowerAndFollowing(me, targetUser);

        if (currentlyFollowing) {
            followRepository.findByFollowerAndFollowing(me, targetUser)
                    .ifPresent(followRepository::delete);
        } else {
            Follow follow = new Follow();
            follow.setFollower(me);
            follow.setFollowing(targetUser);
            followRepository.save(follow);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("followingStatus", !currentlyFollowing);
        response.put("followers", followRepository.countByFollowing(targetUser));
        response.put("following", followRepository.countByFollower(targetUser));

        return ResponseEntity.ok(response);
    }
}