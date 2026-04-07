package com.example.meme;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class UserMeController {

    @GetMapping("/api/users/me")
    public Map<String, Object> me(@AuthenticationPrincipal Jwt jwt) {
        return Map.of(
                "sub", jwt.getSubject(),
                "email", jwt.getClaim("email"),
                "name", jwt.getClaim("name"),
                "nickname", jwt.getClaim("nickname")
        );
    }
}