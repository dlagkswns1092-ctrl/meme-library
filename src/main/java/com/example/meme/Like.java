package com.example.meme;

import jakarta.persistence.*;

@Entity
@Table(name = "likes",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "meme_id"}))
public class Like {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "meme_id", nullable = false)
    private Meme meme;

    public Like() {}

    public Long getId() { return id; }
    public User getUser() { return user; }
    public Meme getMeme() { return meme; }
    public void setUser(User user) { this.user = user; }
    public void setMeme(Meme meme) { this.meme = meme; }
}
