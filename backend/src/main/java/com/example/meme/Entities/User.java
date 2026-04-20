package com.example.meme.Entities;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "auth0_id", nullable = false, unique = true)
    private String auth0Id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, unique = true)
    private String nickname;

    @Column(name = "profile_image_path")
    private String profileImagePath;

    public User() {}

    public Long getId() { return id; }
    public String getAuth0Id() { return auth0Id; }
    public String getEmail() { return email; }
    public String getNickname() { return nickname; }
    public String getProfileImagePath() { return profileImagePath; }

    public void setAuth0Id(String auth0Id) { this.auth0Id = auth0Id; }
    public void setEmail(String email) { this.email = email; }
    public void setNickname(String nickname) { this.nickname = nickname; }
    public void setProfileImagePath(String profileImagePath) { this.profileImagePath = profileImagePath; }
}