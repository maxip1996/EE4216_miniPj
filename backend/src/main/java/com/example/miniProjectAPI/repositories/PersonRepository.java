package com.example.miniProjectAPI.repositories;

import com.example.miniProjectAPI.models.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PersonRepository extends JpaRepository<Person, String> { }
