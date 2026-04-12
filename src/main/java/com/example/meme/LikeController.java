package com.example.meme;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/likes")
public class LikeController {

    private final LikeRepository likeRepository;
    private final MemeRepository memeRepository;
    private final UserRepository userRepository;

    public LikeController(LikeRepository likeRepository,
                          MemeRepository memeRepository,
                          UserRepository userRepository) {
        this.likeRepository = likeRepository;
        this.memeRepository = memeRepository;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<?> toggleLike(@RequestParam Long userId,
                                        @RequestParam Long memeId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Meme meme = memeRepository.findById(memeId)
                .orElseThrow(() -> new RuntimeException("Meme not found"));

        if (likeRepository.existsByUserIdAndMemeId(userId, memeId)) {
            Like like = likeRepository.findByUserIdAndMemeId(userId, memeId).get();
            likeRepository.delete(like);
            meme.setLikeCount(meme.getLikeCount() - 1);
            memeRepository.save(meme);
            return ResponseEntity.ok("unliked");
        } else {
            Like like = new Like();
            like.setUser(user);
            like.setMeme(meme);
            likeRepository.save(like);
            meme.setLikeCount(meme.getLikeCount() + 1);
            memeRepository.save(meme);
            return ResponseEntity.ok("liked");
        }
    }

    @GetMapping("/count")
    public ResponseEntity<?> getLikeCount(@RequestParam Long memeId) {
        long count = likeRepository.countByMemeId(memeId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/check")
    public ResponseEntity<?> checkLike(@RequestParam Long userId,
                                       @RequestParam Long memeId) {
        boolean liked = likeRepository.existsByUserIdAndMemeId(userId, memeId);
        return ResponseEntity.ok(liked);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getLikedMemes(@PathVariable Long userId) {
        if (!userRepository.existsById(userId)) {
            return ResponseEntity.notFound().build();
        }
        List<Meme> likedMemes = likeRepository.findLikedMemesByUserId(userId);
        return ResponseEntity.ok(likedMemes);
    }
}
