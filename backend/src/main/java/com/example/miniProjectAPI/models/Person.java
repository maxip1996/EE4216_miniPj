package com.example.miniProjectAPI.models;

import javax.persistence.*;

@Entity
@Table(name="Person")
public class Person
{
    @Id
    private String username;

    private String password;

    public Person() {}

    public Person(String username, String password)
    {
        this.username = username;
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}


