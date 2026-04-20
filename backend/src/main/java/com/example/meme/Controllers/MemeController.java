package com.example.meme.Controllers;

import com.example.meme.*;
import com.example.meme.Entities.Hashtag;
import com.example.meme.Entities.Meme;
import com.example.meme.Entities.User;
import com.example.meme.Repos.HashtagRepository;
import com.example.meme.Repos.MemeRepository;
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
import java.util.ArrayList;
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

    @PostMapping
    public ResponseEntity<?> createMeme(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam("title") String title,
            @RequestParam("tags") List<String> tags,
            @RequestParam(value = "mediaType", required = false) String mediaType,
            @RequestParam(value = "ageGroups", required = false) List<String> ageGroups,
            @RequestParam("file") MultipartFile file
    ) throws IOException {
        String auth0Id = jwt.getSubject();

        User user = userRepository.findByAuth0Id(auth0Id)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다. 먼저 로그인하세요."));

        if (mediaType != null) {
            List<String> validMediaTypes = List.of("이미지", "gif");
            if (!validMediaTypes.contains(mediaType)) {
                return ResponseEntity.badRequest().body("mediaType은 이미지 또는 gif 중 하나여야 합니다.");
            }
        }

        if (ageGroups != null) {
            List<String> validAgeGroups = List.of("10대", "20대", "30대");
            for (String age : ageGroups) {
                if (!validAgeGroups.contains(age)) {
                    return ResponseEntity.badRequest().body("ageGroup은 10대, 20대, 30대 중에서만 선택 가능합니다.");
                }
            }
        }

        String uploadDir = "uploads/";
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        String fileType = fileName.endsWith(".mp4") ? "mp4" : "image";

        Path filePath = Paths.get(uploadDir + fileName);
        Files.createDirectories(filePath.getParent());
        Files.write(filePath, file.getBytes());

        List<String> allTags = new ArrayList<>(tags);
        if (mediaType != null) allTags.add(mediaType);
        if (ageGroups != null) allTags.addAll(ageGroups);

        List<Hashtag> fixedHashtags = hashtagRepository.findByTagType(TagType.FIXED);

        List<Hashtag> hashtags = allTags.stream()
                .map(String::trim)
                .filter(t -> !t.isEmpty())
                .map(tagName -> {
                    return fixedHashtags.stream()
                            .filter(h -> h.getTag().equals(tagName))
                            .findFirst()
                            .orElseGet(() -> {
                                return hashtagRepository.findByTag(tagName)
                                        .orElseGet(() -> {
                                            Hashtag h = new Hashtag();
                                            h.setTag(tagName);
                                            h.setTagType(TagType.FREE);
                                            return hashtagRepository.save(h);
                                        });
                            });
                })
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

    @GetMapping("/{id}")
    public ResponseEntity<?> getMemeById(@PathVariable Long id) {
        return memeRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public List<Meme> getAllMemes(@RequestParam(required = false) List<String> tags) {
        if (tags != null && !tags.isEmpty()) {
            if (tags.size() == 1) {
                return memeRepository.findByHashtag(tags.get(0));
            } else {
                return memeRepository.findByAllHashtags(tags, tags.size());
            }
        }
        return memeRepository.findAll();
    }

    @GetMapping("/most-liked")
    public List<Meme> getMostLiked() {
        return memeRepository.findAllOrderByLikeCountDesc();
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyMemes(@AuthenticationPrincipal Jwt jwt) {
        String auth0Id = jwt.getSubject();
        User user = userRepository.findByAuth0Id(auth0Id)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));
        List<Meme> myMemes = memeRepository.findByUserId(user.getId());
        return ResponseEntity.ok(myMemes);
    }

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