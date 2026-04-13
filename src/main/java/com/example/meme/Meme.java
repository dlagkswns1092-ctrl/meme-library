package com.example.meme;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.util.List;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "memes")
public class Meme {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private String title;
    private String filePath;
    private String fileType;
    private int likeCount = 0;


    @ManyToMany
    @JoinTable(
            name = "meme_hashtags",
            joinColumns = @JoinColumn(name = "meme_id"),
            inverseJoinColumns = @JoinColumn(name = "hashtag_id")
    )
    private List<Hashtag> hashtags;

    public Meme() {}

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getFilePath() { return filePath; }
    public String getFileType() { return fileType; }
    public int getLikeCount() { return likeCount; }
    public java.util.List<Hashtag> getHashtags() { return hashtags; }

    public void setTitle(String title) { this.title = title; }
    public void setFilePath(String filePath) { this.filePath = filePath; }
    public void setFileType(String fileType) { this.fileType = fileType; }
    public void setLikeCount(int likeCount) { this.likeCount = likeCount; }
    public void setHashtags(java.util.List<Hashtag> hashtags) { this.hashtags = hashtags; }
    public void setUserId(Long userId) { this.userId = userId; }
}
