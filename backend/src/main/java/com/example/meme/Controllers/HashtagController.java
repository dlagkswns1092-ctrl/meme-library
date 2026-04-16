package com.example.meme.Controllers;

import com.example.meme.Entities.Hashtag;
import com.example.meme.Repos.HashtagRepository;
import com.example.meme.TagType;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/hashtags")
public class HashtagController {

    private final HashtagRepository hashtagRepository;

    public HashtagController(HashtagRepository hashtagRepository) {
        this.hashtagRepository = hashtagRepository;
    }

    @GetMapping("/fixed")
    public List<Hashtag> getFixedTags() {
        return hashtagRepository.findByTagType(TagType.FIXED);
    }

    @GetMapping("/fixed/media-type")
    public List<Hashtag> getMediaTypeTags() {
        return hashtagRepository.findByCategory("media_type");
    }

    @GetMapping("/fixed/age-group")
    public List<Hashtag> getAgeGroupTags() {
        return hashtagRepository.findByCategory("age_group");
    }
}