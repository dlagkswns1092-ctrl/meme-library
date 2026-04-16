package com.example.meme.Repos;

import com.example.meme.Entities.Hashtag;
import com.example.meme.TagType;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final HashtagRepository hashtagRepository;

    public DataInitializer(HashtagRepository hashtagRepository) {
        this.hashtagRepository = hashtagRepository;
    }

    @Override
    public void run(String... args) {
        insertFixedTag("이미지", "media_type");
        insertFixedTag("gif", "media_type");
        insertFixedTag("10대", "age_group");
        insertFixedTag("20대", "age_group");
        insertFixedTag("30대", "age_group");
    }

    private void insertFixedTag(String tag, String category) {
        if (hashtagRepository.findByTag(tag).isEmpty()) {
            Hashtag h = new Hashtag();
            h.setTag(tag);
            h.setTagType(TagType.FIXED);
            h.setCategory(category);
            hashtagRepository.save(h);
        }
    }
}