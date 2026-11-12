package org.example.daos;

import org.example.exceptions.NoTitleException;
import org.example.models.Book;
import org.example.models.WishList;
import org.example.models.WishListBook;
import org.example.models.WishListBookWithReview;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.auditing.CurrentDateTimeProvider;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.server.ResponseStatusException;

import javax.sql.DataSource;
import java.sql.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Component
public class WishListBookDao {
    /**
     * JDBC template for querying database.
     */
    private final JdbcTemplate jdbcTemplate;
    //private String username;


    /**
     * This will NEVER have defaults because
     * wishlistbooks will always point to a book
     * and a wishlist that already exist
     */
    private static final int MAX_WISHLIST_BOOKS = 150;

    //private static final String DEFAULT_NAME = "untitled list";
    @Autowired
    public WishListBookDao(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    public List<WishListBook> getWishListBooks() {
        return jdbcTemplate.query("SELECT * FROM wishlist_books;", this::mapToWishListBook);
    }

    ///
    //Making new thingies from scratch
    //because this one takes a lot of joins
    public List<WishListBookWithReview> getWishListBooksByListId(String username, long wishlist_id) {
        try {
            return jdbcTemplate.query("SELECT books.*, reviews.review_text, reviews.id AS review_id " +
                            "FROM books " +
                            "JOIN wishlist_books ON books.id = wishlist_books.book_id " +
                            "JOIN wishlists ON wishlist_books.wishlist_id = wishlists.id " +
                            "LEFT JOIN reviews ON books.id = reviews.book_id AND reviews.username = wishlists.username " +
                            "WHERE wishlist_books.wishlist_id = ? AND wishlists.username = ?;",
                    this::mapToBookWithReviews, wishlist_id, username);
        } catch (EmptyResultDataAccessException e) {
            e.printStackTrace();
            return null;
        }
    }

    public WishListBook getWishListBook(String username, long wishlist_id, long book_id) {
        try {
            return jdbcTemplate.queryForObject("SELECT * FROM wishlist_books WHERE wishlist_id=? AND book_id=?;", this::mapToWishListBook, wishlist_id, book_id);
        } catch (EmptyResultDataAccessException e) {
            e.printStackTrace();
            return null;
        }
    }

    //in other words, this is called "createWishListBook"
    public WishListBook addBookToWishList(long book_id, String username, long wishlist_id) {
        //String sql = "INSERT INTO wishlist_books (wishlist_id, book_id) VALUES (?, ?);";

        if (wishlist_id <= 0L || book_id <= 0L) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "WishListBooks must have a valid wishlist_id and book_id");
        }
//        if (alreadyInDatabase(book_id, wishlist_id)) {
//            throw new DuplicateKeyException("WishListBooks with username " + username + " and wishlist id " + wishlist_id + " already exists");
//        }
        //No need for KeyHolder here, as there is no primary key and
        //wishlistbooks are made with a unique book_id:wishlist_id pair
//        KeyHolder keyHolder = new GeneratedKeyHolder();
        //check how many books are already in a wishlist
        //and prevent additions beyond 150 books
        Integer count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM wishlist_books WHERE wishlist_id = ?;", Integer.class, wishlist_id);
        if (count >= MAX_WISHLIST_BOOKS && count != null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "A wishlist can hold at most " + MAX_WISHLIST_BOOKS + " books.");
        }

        try {
            jdbcTemplate.update(
                    "INSERT INTO wishlist_books (wishlist_id, book_id) VALUES (?, ?)",
                    wishlist_id, book_id);
        } catch (DuplicateKeyException e) {
            // PRIMARY KEY (wishlist_id, book_id) rejected it.
            // Must come before DataIntegrityViolationException, its parent class.
            throw new ResponseStatusException(HttpStatus.CONFLICT, "That book is already on this wishlist.");
        } catch (DataIntegrityViolationException e) {
            // A foreign key rejected it: the book (or wishlist) doesn't exist
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No book exists with id " + book_id + ".");
        }

        // We know the exact primary key of the row we just inserted, so read it back directly
        return getWishListBook(username, wishlist_id, book_id);
    }

    //
//    /**
//     * Private method to check if entries are blank
//     */
    private boolean isBlank(String s) {
        return s == null || s.trim().isEmpty() || s.isBlank();
    }

    /**
     * Private method to check if a book
     * with a certain title+author combo
     * is already in the database
     *
     * @param book
     * @return
     */
    private boolean alreadyInDatabase(Book book, long wishlist_id) {
        //Simply check if the select query returns any WishListBooks that match the query
        String sql = "SELECT * FROM wishlist_books WHERE book_id = ? AND wishlist_id = ?;";
        ArrayList<WishListBook> books = (ArrayList<WishListBook>) jdbcTemplate.query(sql, this::mapToWishListBook, book.getId(), wishlist_id);

        return books != null && books.size() > 0;
    }
//wishlistbook is always going to point to a unique book, but it might as
    //well have the option to change to another list
    public WishList updateWishListBookByBookId(String username, Long book_id, long old_wishlist_id, Long new_wishlist_id) {

        //dont need keyholder because there's no PK AI
//        KeyHolder keyHolder = new GeneratedKeyHolder();
        String sql = "UPDATE wishlist_books SET wishlist_id = ? WHERE book_id = ? AND wishlist_id = ?;";

        try {
            //OrderItem tempOrderItem = jdbcTemplate.queryForObject("SELECT * FROM order_items WHERE id = ?", this::mapToOrderItem, orderItem.getId());
            jdbcTemplate.update(sql, new_wishlist_id, old_wishlist_id, book_id);
            //returns the wishlist the book was sent to
            return jdbcTemplate.queryForObject("SELECT * FROM wishlists WHERE id=?", this::mapToWishList, new_wishlist_id);
        }  catch (DataAccessException e) {
            e.printStackTrace();
            return null;
        }
    }
//
    public int deleteWishListBookByListIdAndBookId(Long wishlist_id, String username, Long book_id) {
        try {
            return jdbcTemplate.update("DELETE FROM wishlist_books WHERE wishlist_id=? AND book_id=?", wishlist_id, book_id);
        } catch (DataAccessException e) {
            e.printStackTrace();
            return 0;
        }
    }

    private WishListBook mapToWishListBook(ResultSet rs, int rowNum) throws SQLException {
        return new WishListBook(
                rs.getLong("wishlist_id"),
                rs.getLong("book_id"),
                rs.getDate("time_added")
        );
    }

    //put the mapToBook function in, as the usual behavior of the WishListBooks API will return books by title, author, etc.
    private Book mapToBook(ResultSet rs, int rowNum) throws SQLException {
        return new Book(
                rs.getLong("id"),
                rs.getString("title"),
                rs.getString("author"),
                rs.getInt("pub_year"),
                rs.getString("isbn_13"),
                rs.getInt("pages")
        );
    }

    private WishListBookWithReview mapToBookWithReviews(ResultSet rs, int rowNum) throws SQLException {
        return new WishListBookWithReview(
                rs.getLong("id"),
                rs.getString("title"),
                rs.getString("author"),
                rs.getInt("pub_year"),
                rs.getString("isbn_13"),
                rs.getInt("pages"),
                rs.getString("review_text"),
                rs.getLong("review_id")
        );
    }

    //get that mapToWishList too fuck it get errbody in here
    private WishList mapToWishList(ResultSet rs, int rowNum) throws SQLException {
        return new WishList(
                rs.getLong("id"),
                rs.getString("username"),
                rs.getString("list_title"),
                rs.getBoolean("is_public")
        );
    }
}
