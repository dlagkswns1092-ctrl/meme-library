package com.example.meme.Repos;

import com.example.meme.Entities.Meme;
import com.example.meme.Entities.SavedMeme;
import com.example.meme.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SavedMemeRepository extends JpaRepository<SavedMeme, Long> {
    Optional<SavedMeme> findByUserAndMeme(User user, Meme meme);
    List<SavedMeme> findByUser(User user);
    boolean existsByUserAndMeme(User user, Meme meme);
}