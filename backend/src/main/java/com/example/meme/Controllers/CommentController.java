package com.example.meme.Controllers;

import com.example.meme.Entities.Comment;
import com.example.meme.Entities.Meme;
import com.example.meme.Entities.User;
import com.example.meme.Repos.CommentRepository;
import com.example.meme.Repos.MemeRepository;
import com.example.meme.Repos.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentRepository commentRepository;
    private final MemeRepository memeRepository;
    private final UserRepository userRepository;

    public CommentController(
            CommentRepository commentRepository,
            MemeRepository memeRepository,
            UserRepository userRepository
    ) {
        this.commentRepository = commentRepository;
        this.memeRepository = memeRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<?> getComments(@RequestParam Long memeId) {
        Meme meme = memeRepository.findById(memeId)
                .orElseThrow(() -> new RuntimeException("밈을 찾을 수 없습니다."));

        List<Map<String, Object>> result = commentRepository.findByMemeOrderByCreatedAtAsc(meme)
                .stream()
                .map(comment -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", comment.getId());
                    map.put("author", comment.getUser().getNickname());
                    map.put("text", comment.getText());
                    map.put("createdAt", comment.getCreatedAt());
                    return map;
                })
                .toList();

        return ResponseEntity.ok(result);
    }

    @PostMapping
    public ResponseEntity<?> createComment(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam Long memeId,
            @RequestBody Map<String, String> body
    ) {
        String auth0Id = jwt.getSubject();

        User user = userRepository.findByAuth0Id(auth0Id)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다. 먼저 로그인하세요."));

        Meme meme = memeRepository.findById(memeId)
                .orElseThrow(() -> new RuntimeException("밈을 찾을 수 없습니다."));

        String text = body.get("text");
        if (text == null || text.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("댓글 내용을 입력해주세요.");
        }

        Comment comment = new Comment();
        comment.setUser(user);
        comment.setMeme(meme);
        comment.setText(text.trim());

        Comment saved = commentRepository.save(comment);

        Map<String, Object> response = new HashMap<>();
        response.put("id", saved.getId());
        response.put("author", user.getNickname());
        response.put("text", saved.getText());
        response.put("createdAt", saved.getCreatedAt());

        return ResponseEntity.ok(response);
    }
}