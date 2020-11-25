package com.example.miniProjectAPI.models;

import javax.persistence.*;

@Entity
@Table(name="Note")
public class Note
{
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    private String name;
    private String text;
    private String colour;
    private int font_size;
    private String username;

    // Used exclusively by web frontend
    private int x_coordinate;
    private int y_coordinate;
    private int width;
    private int height;

    // Used exclusively by mobile frontend
    private int importance;
    private boolean favourite;

    public Note() {}

    public Note(String name,
                String text,
                String colour,
                int font_size,
                int x_coordinate,
                int y_coordinate,
                int width,
                int height,
                int importance,
                boolean favourite,
                String username)
    {
        this.name = name;
        this.text = text;
        this.colour = colour;
        this.font_size = font_size;
        this.username = username;
        this.x_coordinate = x_coordinate;
        this.y_coordinate = y_coordinate;
        this.width = width;
        this.height = height;
        this.importance = importance;
        this.favourite = favourite;
    }

    public int getFont_size() { return font_size; }

    public void setFont_size(int font_size) {
        this.font_size = font_size;
    }

    public int getWidth() {
        return width;
    }

    public void setWidth(int width) {
        this.width = width;
    }

    public int getHeight() {
        return height;
    }

    public void setHeight(int height) {
        this.height = height;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getColour() {
        return colour;
    }

    public void setColour(String colour) {
        this.colour = colour;
    }

    public int getX_coordinate() {
        return x_coordinate;
    }

    public void setX_coordinate(int x_coordinate) {
        this.x_coordinate = x_coordinate;
    }

    public int getY_coordinate() {
        return y_coordinate;
    }

    public void setY_coordinate(int y_coordinate) {
        this.y_coordinate = y_coordinate;
    }

    public int getImportance() {
        return importance;
    }

    public void setImportance(int importance) {
        this.importance = importance;
    }

    public boolean isFavourite() {
        return favourite;
    }

    public void setFavourite(boolean favourite) {
        this.favourite = favourite;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
