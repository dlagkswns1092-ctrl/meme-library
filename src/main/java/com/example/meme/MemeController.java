package com.example.meme;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;


@RestController
@RequestMapping("/memes")
public class MemeController {

    private final MemeRepository memeRepository;

    public MemeController(MemeRepository memeRepository) {
        this.memeRepository = memeRepository;
    }

    @PostMapping
    public Meme createMeme(
            @RequestParam("title") String title,
            @RequestParam("tag") String tag,
            @RequestParam("image") MultipartFile file
    ) throws IOException {

        String uploadDir = "uploads/";
        String fileName = file.getOriginalFilename();

        Path filePath = Paths.get(uploadDir + fileName);
        Files.createDirectories(filePath.getParent());
        Files.write(filePath, file.getBytes());

        Meme meme = new Meme();
        meme.setTitle(title);
        meme.setTag(tag);
        meme.setImagePath(fileName);

        return memeRepository.save(meme);
    }

    @GetMapping
    public List<Meme> getAllMemes() {
        return memeRepository.findAll();
    }

    @GetMapping("/tag/{tag}")
    public List<Meme> getByTag(@PathVariable String tag) {
        return memeRepository.findByTag(tag);
    }

    @DeleteMapping("/{id}")
    public String deleteMeme(@PathVariable Long id) throws IOException {

        Meme meme = memeRepository.findById(id)
                .orElseThrow();

        Path filePath = Paths.get("uploads/" + meme.getImagePath());
        Files.deleteIfExists(filePath);

        memeRepository.deleteById(id);

        return "Deleted";
    }
}