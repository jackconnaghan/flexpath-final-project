package org.example.models;

import java.sql.Date;

public class Review {
    /**
     * Private varibales
     */
    private Long id;
//    private Long user_id;
    private String username;
    private Long book_id;
    private String review_text;
    private Integer star_rating;
    private Date review_date;

    public Review() {}

//    //Users don't need to add text to a review, but they must add a star rating
//    public Review(Long id, Long user_id, Long book_id, int star_rating, Date review_date) {
//        this.id = id;
//        this.user_id = user_id;
//        this.book_id = book_id;
//        this.star_rating = star_rating;
//        this.review_date = review_date;
//    }

    //Don't use two constructors to deal with two potential creations of an object,
    //handle the logic of the object elsewhere. Such as in the ReviewDao(see createReview
    //for the review-filling code).

    public Review(Long id, Long user_id, String username, Long book_id, String review_text, int star_rating, Date review_date) {
        this.id = id;
        //this.user_id = user_id;
        this.username = username;
        this.book_id = book_id;
        this.review_text = review_text;
        this.star_rating = star_rating;
        this.review_date = review_date;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

//    public Long getUser_id() {
//        return user_id;
//    }
//
//    public void setUser_id(Long user_id) {
//        this.user_id = user_id;
//    }

    public Long getBook_id() {
        return book_id;
    }

    public void setBook_id(Long book_id) {
        this.book_id = book_id;
    }

    public String getReview_text() {
        return review_text;
    }

    public void setReview_text(String review_text) {
        this.review_text = review_text;
    }

    public Integer getStar_rating() {
        return star_rating;
    }

    public void setStar_rating(int star_rating) {
        this.star_rating = star_rating;
    }

    public Date getReview_date() {
        return review_date;
    }

    public void setReview_date(Date review_date) {
        this.review_date = review_date;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

}
