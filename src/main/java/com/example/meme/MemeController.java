package com.example.meme;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.web.servlet.view.RedirectView;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/memes")
public class MemeController {

    private final MemeRepository memeRepository;
    private final HashtagRepository hashtagRepository;

    public MemeController(MemeRepository memeRepository, HashtagRepository hashtagRepository) {
        this.memeRepository = memeRepository;
        this.hashtagRepository = hashtagRepository;
    }

    @PostMapping
    public ResponseEntity<?> createMeme(
            @RequestParam("title") String title,
            @RequestParam("mediaType") String mediaType,
            @RequestParam("ageGroups") List<String> ageGroups,
            @RequestParam(value = "tags", required = false) List<String> freeTags,
            @RequestParam("file") MultipartFile file,
            @RequestParam("userId") Long userId
    ) throws IOException {

        List<String> validMediaTypes = List.of("이미지", "gif");
        if (!validMediaTypes.contains(mediaType)) {
            return ResponseEntity.badRequest().body("mediaType은 이미지 또는 gif 중 하나여야 합니다.");
        }

        List<String> validAgeGroups = List.of("10대", "20대", "30대");
        for (String age : ageGroups) {
            if (!validAgeGroups.contains(age)) {
                return ResponseEntity.badRequest().body("ageGroup은 10대, 20대, 30대 중에서만 선택 가능합니다.");
            }
        }

        String uploadDir = "uploads/";
        String fileName = file.getOriginalFilename();
        String fileType = fileName.endsWith(".mp4") ? "mp4" : "image";

        Path filePath = Paths.get(uploadDir + fileName);
        Files.createDirectories(filePath.getParent());
        Files.write(filePath, file.getBytes());

        List<String> allTags = new java.util.ArrayList<>();
        allTags.add(mediaType);
        allTags.addAll(ageGroups);
        if (freeTags != null) allTags.addAll(freeTags);

        List<Hashtag> hashtags = allTags.stream()
                .map(String::trim)
                .filter(t -> !t.isEmpty())
                .map(tagName -> hashtagRepository.findByTag(tagName)
                        .orElseGet(() -> {
                            Hashtag h = new Hashtag();
                            h.setTag(tagName);
                            h.setTagType(TagType.FREE);
                            return hashtagRepository.save(h);
                        }))
                .collect(Collectors.toList());

        Meme meme = new Meme();
        meme.setTitle(title);
        meme.setFilePath(fileName);
        meme.setFileType(fileType);
        meme.setHashtags(hashtags);
        meme.setUserId(userId);

        memeRepository.save(meme);

        return ResponseEntity.ok("업로드 성공");
    }

    @GetMapping
    public List<Meme> getAllMemes(@RequestParam(required = false) List<String> tags) {
        if (tags != null && !tags.isEmpty()) {
            return memeRepository.findByAllHashtags(tags, tags.size());
        }
        return memeRepository.findAll();
    }

    @DeleteMapping("/{id}")
    public String deleteMeme(@PathVariable Long id) throws IOException {
        Meme meme = memeRepository.findById(id).orElseThrow();

        Path filePath = Paths.get("uploads/" + meme.getFilePath());
        Files.deleteIfExists(filePath);

        memeRepository.deleteById(id);
        return "Deleted";
    }

    @GetMapping("/most-liked")
    public List<Meme> getMostLiked() {
        return memeRepository.findAllOrderByLikeCountDesc();
    }
}