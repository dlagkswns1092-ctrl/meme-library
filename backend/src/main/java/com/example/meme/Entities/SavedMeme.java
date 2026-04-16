package com.example.meme.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(
        name = "saved_memes",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "meme_id"})
)
public class SavedMeme {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "meme_id", nullable = false)
    @JsonIgnore
    private Meme meme;

    public SavedMeme() {}

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public Meme getMeme() {
        return meme;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setMeme(Meme meme) {
        this.meme = meme;
    }
}