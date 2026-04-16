package com.example.meme.Repos;

import com.example.meme.Entities.Comment;
import com.example.meme.Entities.Meme;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByMemeOrderByCreatedAtAsc(Meme meme);
}