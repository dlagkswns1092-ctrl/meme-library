package com.example.meme.Controllers;

import com.example.meme.Entities.User;
import com.example.meme.Repos.UserRepository;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class UserMeController {

    private final UserRepository userRepository;

    public UserMeController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/api/users/me")
    public Map<String, Object> me(@AuthenticationPrincipal Jwt jwt) {
        String auth0Id = jwt.getSubject();
        User user = userRepository.findByAuth0Id(auth0Id)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));

        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("sub", jwt.getSubject());
        response.put("email", jwt.getClaim("email") != null ? jwt.getClaim("email") : "");
        response.put("nickname", user.getNickname() != null ? user.getNickname() : "");
        response.put("profileImagePath", user.getProfileImagePath() != null ? user.getProfileImagePath() : "");
        return response;
    }
}