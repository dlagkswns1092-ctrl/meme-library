package com.example.meme;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import java.util.List;
import java.util.stream.Collectors;

@Controller
public class ViewController {

    private final MemeRepository memeRepository;
    private final HashtagRepository hashtagRepository;

    public ViewController(MemeRepository memeRepository, HashtagRepository hashtagRepository) {
        this.memeRepository = memeRepository;
        this.hashtagRepository = hashtagRepository;
    }

    @GetMapping("/gallery")
    public String gallery(@RequestParam(required = false) List<String> tags, Model model) {

        List<String> distinctTags = hashtagRepository.findAll()
                .stream()
                .map(Hashtag::getTag)
                .distinct()
                .collect(Collectors.toList());

        model.addAttribute("distinctTags", distinctTags);

        if (tags != null && !tags.isEmpty()) {
            if (tags.size() == 1) {

                model.addAttribute("memes", memeRepository.findByHashtag(tags.get(0)));
            } else {

                model.addAttribute("memes", memeRepository.findByAllHashtags(tags, tags.size()));
            }
        } else {
            model.addAttribute("memes", memeRepository.findAll());
        }

        model.addAttribute("currentTags", tags);
        return "gallery";
    }

    @GetMapping("/upload")
    public String upload() {
        return "upload";
    }
}