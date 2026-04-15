package com.example.meme.Controllers;

import com.example.meme.*;
import com.example.meme.Repos.LikeRepository;
import com.example.meme.Repos.MemeRepository;
import com.example.meme.Repos.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/likes")
public class LikeController {

    private final LikeRepository likeRepository;
    private final UserRepository userRepository;
    private final MemeRepository memeRepository;

    public LikeController(LikeRepository likeRepository, UserRepository userRepository, MemeRepository memeRepository) {
        this.likeRepository = likeRepository;
        this.userRepository = userRepository;
        this.memeRepository = memeRepository;
    }

    @PostMapping("/toggle")
    public ResponseEntity<?> toggleLike(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam Long memeId
    ) {
        String auth0Id = jwt.getSubject();

        User user = userRepository.findByAuth0Id(auth0Id)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다. 먼저 동기화가 필요합니다."));

        Meme meme = memeRepository.findById(memeId)
                .orElseThrow(() -> new RuntimeException("밈을 찾을 수 없습니다."));

        if (likeRepository.existsByUserAndMeme(user, meme)) {
            Like like = likeRepository.findByUserAndMeme(user, meme)
                    .orElseThrow(() -> new RuntimeException("좋아요 정보를 찾을 수 없습니다."));

            likeRepository.delete(like);

            if (meme.getLikeCount() > 0) {
                meme.setLikeCount(meme.getLikeCount() - 1);
            }
            memeRepository.save(meme);

            return ResponseEntity.ok(Map.of(
                    "liked", false,
                    "likeCount", meme.getLikeCount()
            ));
        } else {
            Like like = new Like();
            like.setUser(user);
            like.setMeme(meme);
            likeRepository.save(like);

            meme.setLikeCount(meme.getLikeCount() + 1);
            memeRepository.save(meme);

            return ResponseEntity.ok(Map.of(
                    "liked", true,
                    "likeCount", meme.getLikeCount()
            ));
        }
    }

    @GetMapping("/count")
    public ResponseEntity<?> getLikeCount(@RequestParam Long memeId) {
        Meme meme = memeRepository.findById(memeId)
                .orElseThrow(() -> new RuntimeException("밈을 찾을 수 없습니다."));

        long count = likeRepository.countByMeme(meme);
        return ResponseEntity.ok(Map.of("likeCount", count));
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyLikedMemes(@AuthenticationPrincipal Jwt jwt) {
        String auth0Id = jwt.getSubject();

        User user = userRepository.findByAuth0Id(auth0Id)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다. 먼저 동기화가 필요합니다."));

        List<Like> likes = likeRepository.findByUser(user);

        List<Meme> likedMemes = likes.stream()
                .map(Like::getMeme)
                .collect(Collectors.toList());

        return ResponseEntity.ok(likedMemes);
    }
}