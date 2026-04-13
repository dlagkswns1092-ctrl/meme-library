package com.example.meme;

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
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/memes")
public class MemeController {

    private final MemeRepository memeRepository;
    private final HashtagRepository hashtagRepository;
    private final UserRepository userRepository;

    public MemeController(MemeRepository memeRepository, HashtagRepository hashtagRepository, UserRepository userRepository) {
        this.memeRepository = memeRepository;
        this.hashtagRepository = hashtagRepository;
        this.userRepository = userRepository;
    }

    // 밈 업로드 (로그인 필요)
    @PostMapping
    public ResponseEntity<?> createMeme(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam("title") String title,
            @RequestParam("tags") List<String> tags,
            @RequestParam("file") MultipartFile file
    ) throws IOException {
        String auth0Id = jwt.getSubject();

        User user = userRepository.findByAuth0Id(auth0Id)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다. 먼저 로그인하세요."));

        String uploadDir = "uploads/";
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        String fileType = fileName.endsWith(".mp4") ? "mp4" : "image";

        Path filePath = Paths.get(uploadDir + fileName);
        Files.createDirectories(filePath.getParent());
        Files.write(filePath, file.getBytes());

        List<Hashtag> hashtags = tags.stream()
                .map(String::trim)
                .filter(t -> !t.isEmpty())
                .map(tagName -> hashtagRepository.findByTag(tagName)
                        .orElseGet(() -> {
                            Hashtag h = new Hashtag();
                            h.setTag(tagName);
                            return hashtagRepository.save(h);
                        }))
                .collect(Collectors.toList());

        Meme meme = new Meme();
        meme.setTitle(title);
        meme.setFilePath(fileName);
        meme.setFileType(fileType);
        meme.setHashtags(hashtags);
        meme.setUserId(user.getId());

        memeRepository.save(meme);

        return ResponseEntity.ok(Map.of("message", "업로드 성공", "fileName", fileName));
    }

    // 전체 밈 조회 (공개)
    @GetMapping
    public List<Meme> getAllMemes(@RequestParam(required = false) List<String> tags) {
        if (tags != null && !tags.isEmpty()) {
            return memeRepository.findByAllHashtags(tags, tags.size());
        }
        return memeRepository.findAll();
    }

    // 인기순 조회 (공개)
    @GetMapping("/most-liked")
    public List<Meme> getMostLiked() {
        return memeRepository.findAllOrderByLikeCountDesc();
    }

    // 내가 업로드한 밈 조회 (로그인 필요)
    @GetMapping("/my")
    public ResponseEntity<?> getMyMemes(@AuthenticationPrincipal Jwt jwt) {
        String auth0Id = jwt.getSubject();

        User user = userRepository.findByAuth0Id(auth0Id)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));

        List<Meme> myMemes = memeRepository.findByUserId(user.getId());
        return ResponseEntity.ok(myMemes);
    }

    // 밈 삭제 (로그인 필요)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMeme(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Long id
    ) throws IOException {
        Meme meme = memeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("밈을 찾을 수 없습니다."));

        Path filePath = Paths.get("uploads/" + meme.getFilePath());
        Files.deleteIfExists(filePath);

        memeRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "삭제 완료"));
    }
}