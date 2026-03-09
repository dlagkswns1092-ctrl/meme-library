package com.example.meme;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ViewController {

    private final MemeRepository memeRepository;

    public ViewController(MemeRepository memeRepository) {
        this.memeRepository = memeRepository;
    }

    @GetMapping("/gallery")
    public String gallery(Model model) {
        model.addAttribute("memes", memeRepository.findAll());
        return "gallery";
    }
}