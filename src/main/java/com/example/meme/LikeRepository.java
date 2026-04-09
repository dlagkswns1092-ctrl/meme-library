package com.example.meme;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like, Long> {
    Optional<Like> findByUserAndMeme(User user, Meme meme);
    boolean existsByUserAndMeme(User user, Meme meme);
    long countByMeme(Meme meme);
    List<Like> findByUser(User user);
}