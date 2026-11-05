package org.example.models;

public class WishList {
    /**
     * Private variables
     *
     */
    private Long id;
    //private Long user_id;
    private String username;
    private String list_title;
    private boolean is_public;

    public WishList() {}

    public WishList(Long id, String username, boolean is_public) {
        this.id = id;
        //this.user_id = user_id;
        this.is_public = is_public;
    }
    public WishList(Long id, String username, String list_title, boolean is_public) {
        this.id = id;
        //this.user_id = user_id;
        this.username = username;
        this.list_title = list_title;
        this.is_public = is_public;
    }

    /**
     * Getters and Setters
     */
    public Long getId() {return id;}

    public void setId(Long id) {this.id = id;}

//    public Long getUserId() {return user_id;}
//
//    public void setUserId(Long user_id) {this.user_id = user_id;}

    public String getUsername() {return username;}

    public void setUsername(String username) {this.username = username;}

    public boolean isIs_public() {return is_public;}

    public void setIs_public(boolean is_public) {this.is_public = is_public;}

    public String getList_title() {return list_title;}

    public void setList_title(String list_title) {this.list_title = list_title;}
}
