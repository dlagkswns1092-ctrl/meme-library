package com.example.meme;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "hashtags")
public class Hashtag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String tag;

    @Enumerated(EnumType.STRING)
    private TagType tagType;

    private String category;

    @ManyToMany(mappedBy = "hashtags")
    private List<Meme> memes;

    public Long getId() { return id; }
    public String getTag() { return tag; }
    public TagType getTagType() { return tagType; }
    public String getCategory() { return category; }

    public void setTag(String tag) { this.tag = tag; }
    public void setTagType(TagType tagType) { this.tagType = tagType; }
    public void setCategory(String category) { this.category = category; }
}
