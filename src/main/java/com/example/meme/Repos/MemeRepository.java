package com.example.meme.Repos;

import com.example.meme.Meme;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface MemeRepository extends JpaRepository<Meme, Long> {

    @Query("SELECT m FROM Meme m JOIN m.hashtags h WHERE h.tag = :tag")
    List<Meme> findByHashtag(@Param("tag") String tag);

    @Query("SELECT m FROM Meme m JOIN m.hashtags h WHERE h.tag IN :tags GROUP BY m HAVING COUNT(DISTINCT h.tag) = :tagCount")
    List<Meme> findByAllHashtags(@Param("tags") List<String> tags, @Param("tagCount") long tagCount);

    @Query("SELECT m FROM Meme m ORDER BY m.likeCount DESC")
    List<Meme> findAllOrderByLikeCountDesc();

    List<Meme> findByUserId(Long userId);
}