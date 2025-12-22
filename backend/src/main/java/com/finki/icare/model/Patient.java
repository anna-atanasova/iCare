package com.finki.icare.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "patient", schema = "mental_health_app")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@PrimaryKeyJoinColumn(name = "id_user")
public class Patient extends User {

    @ManyToOne
    @JoinColumn(name = "id_therapist")
    private Therapist therapist;

    @JsonIgnore
    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL)
    private List<Blog> blogs;

    @JsonIgnore
    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL)
    private List<Comment> comments;

    @JsonIgnore
    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL)
    private List<Diary> diaries;

    @JsonIgnore
    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL)
    private List<Consultation> consultations;

    @JsonIgnore
    @ManyToMany
    @JoinTable(
        name = "patient_likes_blog",
        schema = "mental_health_app",
        joinColumns = @JoinColumn(name = "id_patient"),
        inverseJoinColumns = @JoinColumn(name = "id_blog")
    )
    private List<Blog> likedBlogs;
}
