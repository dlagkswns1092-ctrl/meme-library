package com.example.meme;

import jakarta.persistence.*;

@Entity
public class Meme {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String tag;
    private String title;
    private String imagePath;

    public Meme() {}

    public Meme(String title, String imagePath) {
        this.title = title;
        this.imagePath = imagePath;
    }

    public Long getId() { return id; }
    public String getTag() { return tag; }
    public String getTitle() { return title; }
    public String getImagePath() { return imagePath; }

    public void setTitle(String title) { this.title = title; }
    public void setTag(String tag) { this.tag = tag; }
    public void setImagePath(String imagePath) { this.imagePath = imagePath; }
}