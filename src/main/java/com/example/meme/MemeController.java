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
    public RedirectView createMeme(
            @RequestParam("title") String title,
            @RequestParam("tags") List<String> tags,
            @RequestParam("file") MultipartFile file
    ) throws IOException {

        String uploadDir = "uploads/";
        String fileName = file.getOriginalFilename();
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

        memeRepository.save(meme);

        return new RedirectView("/gallery");
    }

    @GetMapping
    public List<Meme> getAllMemes(@RequestParam(required = false) List<String> tags) {
        if (tags != null && !tags.isEmpty()) {
            return memeRepository.findByAllHashtags(tags, tags.size());  // ✅ findByTag → findByAllHashtags
        }
        return memeRepository.findAll();
    }

    @DeleteMapping("/{id}")
    public String deleteMeme(@PathVariable Long id) throws IOException {
        Meme meme = memeRepository.findById(id).orElseThrow();

        Path filePath = Paths.get("uploads/" + meme.getFilePath());  // ✅ getImagePath → getFilePath
        Files.deleteIfExists(filePath);

        memeRepository.deleteById(id);
        return "Deleted";
    }
}