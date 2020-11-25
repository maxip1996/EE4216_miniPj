package com.example.miniProjectAPI.controllers;

import com.example.miniProjectAPI.models.Note;
import com.example.miniProjectAPI.repositories.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
@RequestMapping("/api")
public class NoteController
{

    @Autowired
    private NoteRepository noteRepository;

    @GetMapping("/notes")
    public ResponseEntity<?> getAllNotes(Principal principal) {
        try
        {
            List<Note> notes = new ArrayList<>(noteRepository.findAll());
            if (notes.isEmpty())
                return new ResponseEntity<>(notes, HttpStatus.OK);

            List<Note> notesForUser = new ArrayList<>();
            for (Note n: notes)
            {
                if (n.getUsername().equals(principal.getName()))
                    notesForUser.add(n);
            }

            return new ResponseEntity<>(notesForUser, HttpStatus.OK);
        }
        catch (Exception e)
        {
            return new ResponseEntity<>("NOT FOUND", HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/notes/{id}")
    public ResponseEntity<?> getNoteById(@PathVariable("id") int id, Principal principal)
    {
        Optional<Note> noteData = noteRepository.findById(id);

        if (noteData.isPresent())
        {
            Note noteForUser = noteData.get();
            if (noteForUser.getUsername().equals(principal.getName()))
                return new ResponseEntity<>(noteForUser, HttpStatus.OK);
            else
            {
                return new ResponseEntity<>("NOT FOUND", HttpStatus.NOT_FOUND);
            }

        }
        else
        {
            return new ResponseEntity<>("NOT FOUND", HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/notes")
    public ResponseEntity<?> createNote(@RequestBody Note note, Principal principal)
    {
        if (note.getName() == null || note.getName().isBlank())
            note.setName("NoteName");

        if (note.getText() == null)
            note.setText("");

        if (note.getColour() == null || note.getColour().isBlank())
            note.setColour("#0000ff");

        if (note.getFont_size() < 1)
            note.setFont_size(12);

        if (note.getWidth() < 1)
            note.setWidth(300);

        if (note.getHeight() < 1)
            note.setHeight(250);

        try
        {
            Note _note = noteRepository
                    .save(new Note(
                            note.getName(),
                            note.getText(),
                            note.getColour(),
                            note.getFont_size(),
                            note.getX_coordinate(),
                            note.getY_coordinate(),
                            note.getWidth(),
                            note.getHeight(),
                            note.getImportance(),
                            note.isFavourite(),
                            principal.getName()
                            )
                    );
            return new ResponseEntity<>(_note, HttpStatus.CREATED);
        }
        catch (Exception e)
        {
            return new ResponseEntity<>("INTERNAL SERVER ERROR", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/notes/{id}")
    public ResponseEntity<?> updateNote(@PathVariable("id") int id, @RequestBody Note note, Principal principal) {
        Optional<Note> noteData = noteRepository.findById(id);

        if (noteData.isPresent())
        {
            Note _note = noteData.get();
            if (_note.getUsername().equals(principal.getName()))
            {
                _note.setColour(note.getColour());
                _note.setFavourite(note.isFavourite());
                _note.setFont_size(note.getFont_size());
                _note.setHeight(note.getHeight());
                _note.setWidth(note.getWidth());
                _note.setName(note.getName());
                _note.setImportance(note.getImportance());
                _note.setX_coordinate(note.getX_coordinate());
                _note.setY_coordinate(note.getY_coordinate());
                _note.setText(note.getText());

                return new ResponseEntity<>(noteRepository.save(_note), HttpStatus.OK);
            }
            else
            {
                return new ResponseEntity<>("NOT FOUND", HttpStatus.NOT_FOUND);
            }
        }
        else
        {
            return new ResponseEntity<>("NOT FOUND", HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/notes/{id}")
    public ResponseEntity<?> deleteNote(@PathVariable("id") int id, Principal principal)
    {
        try
        {
            Optional<Note> noteData = noteRepository.findById(id);
            if (noteData.isPresent())
            {
                Note note = noteData.get();
                if (note.getUsername().equals(principal.getName()))
                {
                    noteRepository.deleteById(id);
                    return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
                }
                return new ResponseEntity<>("NOT FOUND", HttpStatus.NOT_FOUND);

            }
            else
            {
                return new ResponseEntity<>("NOT FOUND", HttpStatus.NOT_FOUND);
            }
        }
        catch (Exception e)
        {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
