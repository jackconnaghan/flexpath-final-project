package org.example.models;

public class Book {
    /**
     * Private variables
     */
    private int id;
    private String title;
    private String author;
    private int pub_year;
    private String isbn13;
    private int pages;

    /**
     * Blank Constructor
     */
    //* Blank constructor
    public Book() {}

    /**
     *
     * @param id = book id in the db
     * @param author = author of the book
     * @param title = title of the book
     * @param pub_year = publication year
     * @param isbn13 = ISBN-13 number
     * @param pages = number of pages in the book
     */
    public Book(int id, String author, String title, int pub_year, String isbn13, int pages) {
        this.id = id;
        this.author = author;
        this.title = title;
        this.pub_year = pub_year;
        this.isbn13 = isbn13;
        this.pages = pages;
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

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

}