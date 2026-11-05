package org.example.models;

import java.sql.Date;

public class WishListBook {


    public long getWishlist_id() {
        return wishlist_id;
    }

    public void setWishlist_id(long wishlist_id) {
        this.wishlist_id = wishlist_id;
    }

    public long getBook_id() {
        return book_id;
    }

    public void setBook_id(long book_id) {
        this.book_id = book_id;
    }

    public Date getTime_added() {
        return time_added;
    }

    public void setTime_added(Date time_added) {
        this.time_added = time_added;
    }

    private long wishlist_id;
    private long book_id;
    private Date time_added;

    public WishListBook() {}
    public WishListBook(long wishlist_id, long book_id, Date time_added) {
        this.wishlist_id = wishlist_id;
        this.book_id = book_id;
        this.time_added = time_added;
    }

}
