package com.example.miniProjectAPI.controllers;

import com.example.miniProjectAPI.models.AuthenticationRequest;
import com.example.miniProjectAPI.models.AuthenticationResponse;
import com.example.miniProjectAPI.models.Person;
import com.example.miniProjectAPI.repositories.PersonRepository;
import com.example.miniProjectAPI.services.MyUserDetailsService;
import com.example.miniProjectAPI.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
@RequestMapping("/users")
public class AuthController
{
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private MyUserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PersonRepository personRepository;

    @PostMapping("/authenticate")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody AuthenticationRequest authenticationRequest) throws Exception
    {
        if (authenticationRequest.getUsername().isBlank() || authenticationRequest.getPassword().isBlank())
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Username/Password is blank.");
        try
        {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken (
                            authenticationRequest.getUsername(),
                            authenticationRequest.getPassword()
                    )
            );
        }
        catch (BadCredentialsException e)
        {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getLocalizedMessage());
        }

        final UserDetails userDetails = userDetailsService.loadUserByUsername(authenticationRequest.getUsername());
        final String jwt = jwtUtil.generateToken(userDetails);

        return ResponseEntity.ok(new AuthenticationResponse(jwt));
    }

    @PostMapping("/create")
    public ResponseEntity<?> createUser(@RequestBody AuthenticationRequest authenticationRequest)
    {
        if (authenticationRequest.getUsername().isBlank() || authenticationRequest.getPassword().isBlank())
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username/Password is blank.");

        Optional<Person> person = personRepository.findById(authenticationRequest.getUsername());

        if (person.isEmpty())
        {
            try
            {
                Person _person = new Person(authenticationRequest.getUsername(), authenticationRequest.getPassword());
                personRepository.save(_person);
                return new ResponseEntity<>(_person, HttpStatus.CREATED);
            }
            catch (Exception e)
            {
                return new ResponseEntity<>(e, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        else
        {
            return new ResponseEntity<>("Username already exists! Please register with a unique username.", HttpStatus.BAD_REQUEST);
        }
    }
}
