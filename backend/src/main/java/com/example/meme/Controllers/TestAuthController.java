package com.example.meme.Controllers;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestAuthController {

    @GetMapping("/api/public/test")
    public String publicTest() {
        return "public ok";
    }

    @GetMapping("/api/private/test")
    public String privateTest(Authentication authentication) {
        return "private ok: " + authentication.getName();
    }
}