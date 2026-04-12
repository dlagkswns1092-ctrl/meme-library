package com.example.meme;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like, Long> {
    Optional<Like> findByUserIdAndMemeId(Long userId, Long memeId);
    boolean existsByUserIdAndMemeId(Long userId, Long memeId);
    long countByMemeId(Long memeId);

    @Query("SELECT l.meme FROM Like l WHERE l.user.id = :userId")
    List<Meme> findLikedMemesByUserId(@Param("userId") Long userId);

}
