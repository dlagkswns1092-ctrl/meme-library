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

    @ManyToMany(mappedBy = "hashtags")
    private List<Meme> memes;

    public Long getId() { return id; }
    public String getTag() { return tag; }
    public void setTag(String tag) { this.tag = tag; }
}
