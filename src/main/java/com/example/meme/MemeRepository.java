package com.example.meme;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MemeRepository extends JpaRepository<Meme, Long> {
    List<Meme> findByTag(String tag);
}