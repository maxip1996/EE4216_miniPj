package com.example.miniProjectAPI.services;

import com.example.miniProjectAPI.models.Person;
import com.example.miniProjectAPI.repositories.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@Service
public class MyUserDetailsService implements UserDetailsService
{

    @Autowired
    PersonRepository personRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException
    {
        Optional<Person> _person = personRepository.findById(username);

        if (_person.isPresent())
            return new User(_person.get().getUsername(), _person.get().getPassword(), new ArrayList<>());

        throw new UsernameNotFoundException("");

    }
}
