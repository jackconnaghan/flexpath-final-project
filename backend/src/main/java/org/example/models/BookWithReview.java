package org.example.models;

import java.sql.Date;

public class BookWithReview {
    /**
     * Private variables
     */
    private Long id;
    private String title;
    private String author;
    private int pub_year;
    private String isbn13;
    private int pages;
    private long review_id;
    private String username;
    private String review_text;
    private Integer star_rating;
    private Date review_date;

    /**
     * Blank Constructor
     */
    //* Blank constructor
    public BookWithReview() {
    }

    /**
     *
     * @param id       = book id in the db
     * @param author   = author of the book
     * @param title    = title of the book
     * @param pub_year = publication year
     * @param isbn13   = ISBN-13 number
     * @param pages    = number of pages in the book
     */
    public BookWithReview(Long id, String title, String author, int pub_year,
                          String isbn13, int pages, long review_id,
                          String username, String review_text, Integer star_rating,
                          Date review_date) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.pub_year = pub_year;
        this.isbn13 = isbn13;
        this.pages = pages;
        this.review_id = review_id;
        this.username = username;
        this.review_text = review_text;
        this.star_rating = star_rating;
        this.review_date = review_date;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public int getPub_year() {
        return pub_year;
    }

    public void setPub_year(int pub_year) {
        this.pub_year = pub_year;
    }

    public String getIsbn13() {
        return isbn13;
    }

    public void setIsbn13(String isbn13) {
        this.isbn13 = isbn13;
    }

    public int getPages() {
        return pages;
    }

    public void setPages(int pages) {
        this.pages = pages;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public long getReview_id() {
        return review_id;
    }

    public void setReview_id(long review_id) {
        this.review_id = review_id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
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

    public void setStar_rating(Integer star_rating) {
        this.star_rating = star_rating;
    }

    public Date getReview_date() {
        return review_date;
    }

    public void setReview_date(Date review_date) {
        this.review_date = review_date;
    }
}