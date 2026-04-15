package com.example.meme.Controllers;

import com.example.meme.User;
import com.example.meme.Repos.UserRepository;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserSyncController {

    private final UserRepository userRepository;

    public UserSyncController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/sync")
    public Map<String, Object> syncUser(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody Map<String, String> body
    ) {
        String auth0Id = jwt.getSubject();
        String email = body.get("email");
        String nickname = body.get("nickname");

        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("email is required");
        }

        User user = userRepository.findByAuth0Id(auth0Id)
                .orElseGet(() -> {
                    Optional<User> existingByEmail = userRepository.findByEmail(email);

                    if (existingByEmail.isPresent()) {
                        User existingUser = existingByEmail.get();
                        existingUser.setAuth0Id(auth0Id);

                        if (nickname != null && !nickname.isBlank()) {
                            existingUser.setNickname(nickname);
                        }

                        return userRepository.save(existingUser);
                    }

                    User newUser = new User();
                    newUser.setAuth0Id(auth0Id);
                    newUser.setEmail(email);

                    if (nickname != null && !nickname.isBlank()) {
                        newUser.setNickname(nickname);
                    } else {
                        newUser.setNickname(email.split("@")[0]);
                    }

                    return userRepository.save(newUser);
                });

        return Map.of(
                "id", user.getId(),
                "auth0Id", user.getAuth0Id(),
                "email", user.getEmail(),
                "nickname", user.getNickname()
        );
    }
}