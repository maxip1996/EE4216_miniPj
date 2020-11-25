package com.example.miniProjectAPI.repositories;
import com.example.miniProjectAPI.models.Note;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NoteRepository extends JpaRepository<Note, Integer> { }
