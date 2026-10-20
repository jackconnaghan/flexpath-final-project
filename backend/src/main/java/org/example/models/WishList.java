package org.example.models;

public class WishList {
    /**
     * Private variables
     */
    private Long id;
    private String username;
    private String name;

    public WishList() {}

    public WishList(Long id, String username) {
        this.id = id;
        this.username = username;
    }
    public WishList(Long id, String username, String name) {
        this.id = id;
        this.username = username;
        this.name = name;
    }

    /**
     * Getters and Setters
     */
    public Long getId() {return id;}

    public void setId(Long id) {this.id = id;}

    public String getUsername() {return username;}

    public void setUsername(String username) {this.username = username;}

    public String getName() {return name;}

    public void setName(String name) {this.name = name;}

}
