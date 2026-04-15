package com.example.meme.Repos;

import com.example.meme.Hashtag;
import com.example.meme.TagType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface HashtagRepository extends JpaRepository<Hashtag, Long> {
    Optional<Hashtag> findByTag(String tag);
    List<Hashtag> findByTagType(TagType tagType);
    List<Hashtag> findByCategory(String category);
}
