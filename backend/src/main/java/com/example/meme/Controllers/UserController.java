package com.example.meme.Controllers;

import com.example.meme.Entities.User;
import com.example.meme.Repos.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateMe(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody Map<String, String> body
    ) {
        String auth0Id = jwt.getSubject();
        User user = userRepository.findByAuth0Id(auth0Id)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));

        String nickname = body.get("nickname");
        if (nickname != null && !nickname.trim().isEmpty()) {
            user.setNickname(nickname.trim());
        }

        userRepository.save(user);
        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "nickname", user.getNickname(),
                "email", user.getEmail()
        ));
    }

    @PostMapping("/me/profile-image")
    public ResponseEntity<?> uploadProfileImage(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam("file") MultipartFile file
    ) throws IOException {
        String auth0Id = jwt.getSubject();
        User user = userRepository.findByAuth0Id(auth0Id)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));

        String uploadDir = "uploads/profiles/";
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(uploadDir + fileName);
        Files.createDirectories(filePath.getParent());
        Files.write(filePath, file.getBytes());

        user.setProfileImagePath("profiles/" + fileName);
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("profileImagePath", "profiles/" + fileName));
    }
}