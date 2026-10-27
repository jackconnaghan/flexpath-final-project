package org.example.models;

public class WishList {
    /**
     * Private variables
     */
    private Long id;
    private Long user_id;
    private String name;
    private boolean is_public;

    public WishList() {}

    public WishList(Long id, Long user_id, boolean is_public) {
        this.id = id;
        this.user_id = user_id;
        this.is_public = is_public;
    }
    public WishList(Long id, Long user_id, String name, boolean is_public) {
        this.id = id;
        this.user_id = user_id;
        this.name = name;
        this.is_public = is_public;
    }

    /**
     * Getters and Setters
     */
    public Long getId() {return id;}

    public void setId(Long id) {this.id = id;}

    public Long getUserId() {return user_id;}

    public void setUserId(Long user_id) {this.user_id = user_id;}

    public String getName() {return name;}

    public void setName(String name) {this.name = name;}

    public boolean isIs_public() {return is_public;}

    public void setIs_public(boolean is_public) {this.is_public = is_public;}
}
