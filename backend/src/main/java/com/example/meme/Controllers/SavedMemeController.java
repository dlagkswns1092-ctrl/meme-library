package com.example.meme.Controllers;

import com.example.meme.Entities.Meme;
import com.example.meme.Entities.SavedMeme;
import com.example.meme.Entities.User;
import com.example.meme.Repos.MemeRepository;
import com.example.meme.Repos.SavedMemeRepository;
import com.example.meme.Repos.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/saved")
public class SavedMemeController {

    private final SavedMemeRepository savedMemeRepository;
    private final MemeRepository memeRepository;
    private final UserRepository userRepository;

    public SavedMemeController(
            SavedMemeRepository savedMemeRepository,
            MemeRepository memeRepository,
            UserRepository userRepository
    ) {
        this.savedMemeRepository = savedMemeRepository;
        this.memeRepository = memeRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/check")
    public ResponseEntity<?> checkSaved(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam Long memeId
    ) {
        if (jwt == null) {
            Map<String, Object> response = new HashMap<>();
            response.put("saved", false);
            return ResponseEntity.ok(response);
        }

        String auth0Id = jwt.getSubject();

        User user = userRepository.findByAuth0Id(auth0Id)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));

        Meme meme = memeRepository.findById(memeId)
                .orElseThrow(() -> new RuntimeException("밈을 찾을 수 없습니다."));

        boolean saved = savedMemeRepository.existsByUserAndMeme(user, meme);

        Map<String, Object> response = new HashMap<>();
        response.put("saved", saved);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<?> saveMeme(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam Long memeId
    ) {
        String auth0Id = jwt.getSubject();

        User user = userRepository.findByAuth0Id(auth0Id)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));

        Meme meme = memeRepository.findById(memeId)
                .orElseThrow(() -> new RuntimeException("밈을 찾을 수 없습니다."));

        if (savedMemeRepository.existsByUserAndMeme(user, meme)) {
            Map<String, Object> response = new HashMap<>();
            response.put("saved", true);
            response.put("message", "이미 저장된 밈입니다.");
            return ResponseEntity.ok(response);
        }

        SavedMeme savedMeme = new SavedMeme();
        savedMeme.setUser(user);
        savedMeme.setMeme(meme);
        savedMemeRepository.save(savedMeme);

        Map<String, Object> response = new HashMap<>();
        response.put("saved", true);
        response.put("message", "저장 완료");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping
    public ResponseEntity<?> unsaveMeme(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam Long memeId
    ) {
        String auth0Id = jwt.getSubject();

        User user = userRepository.findByAuth0Id(auth0Id)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));

        Meme meme = memeRepository.findById(memeId)
                .orElseThrow(() -> new RuntimeException("밈을 찾을 수 없습니다."));

        savedMemeRepository.findByUserAndMeme(user, meme)
                .ifPresent(savedMemeRepository::delete);

        Map<String, Object> response = new HashMap<>();
        response.put("saved", false);
        response.put("message", "저장 해제 완료");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMySavedMemes(@AuthenticationPrincipal Jwt jwt) {
        String auth0Id = jwt.getSubject();

        User user = userRepository.findByAuth0Id(auth0Id)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));

        List<Meme> memes = savedMemeRepository.findByUser(user)
                .stream()
                .map(SavedMeme::getMeme)
                .toList();

        return ResponseEntity.ok(memes);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserSavedMemes(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));

        List<Meme> memes = savedMemeRepository.findByUser(user)
                .stream()
                .map(SavedMeme::getMeme)
                .toList();

        return ResponseEntity.ok(memes);
    }
}