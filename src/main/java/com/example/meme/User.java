package com.example.meme;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private Integer age;

    private String gender;

    private LocalDateTime createdAt;

    public User() {}

    public Long getId() { return id; }
    public String getEmail() { return email; }
    public String getPassword() { return password; }
    public Integer getAge() { return age; }
    public String getGender() { return gender; }

    public void setEmail(String email) { this.email = email; }
    public void setPassword(String password) { this.password = password; }
    public void setAge(Integer age) { this.age = age; }
    public void setGender(String gender) { this.gender = gender; }
}
