package org.example.daos;

import org.apache.ibatis.exceptions.TooManyResultsException;
import org.example.exceptions.NoTitleException;
import org.example.models.Book;
import org.example.models.BookWithReview;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Component
public class BookWithReviewDao {
    /**
     * JDBC template for querying database.
     */
    private final JdbcTemplate jdbcTemplate;

    /**
     * Set Default vals for a book
     */
    private static final String DEFAULT_AUTHOR = "Unknown";
    private static final String DEFAULT_TITLE = "Unknown";
    private static final String DEFAULT_ISBN = "Unknown";
    private static final int DEFAULT_PUB_YEAR = 0;
    private static final int DEFAULT_PAGES = 0;
    private static final String DEFAULT_USERNAME = "nothing";
    private static final String DEFAULT_REVIEW_TEXT = "";
    private static final int DEFAULT_STAR_RATING = 0;
    private static final int minStarRating = 0;
    private static final int maxStarRating = 10;
    private static final Date DEFAULT_REVIEW_DATE =  new Date(19000101);
    private static final boolean DEFAULT_IS_PUBLIC = false;

    /**
     * Create a new book data access object.
     */
    public BookWithReviewDao(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    public List<BookWithReview> getMyBooksWithReviews(String username) throws DataAccessException {
        return jdbcTemplate.query("SELECT books.id AS id, books.title, books.author, books.pub_year, books.isbn_13, books.pages, " +
                "reviews.id AS review_id, reviews.username, reviews.review_text, reviews.star_rating, reviews.review_date, reviews.is_public " +
                "FROM reviews " +
                "JOIN books ON books.id = reviews.book_id " +
                "WHERE reviews.username = ?" +
                "ORDER BY reviews.review_date DESC", this::mapToBookWithReview, username);
    }

    private BookWithReview mapToBookWithReview(ResultSet rs, int rowNum) throws SQLException {
        return new BookWithReview(
                rs.getLong("id"),
                rs.getString("title"),
                rs.getString("author"),
                rs.getInt("pub_year"),
                rs.getString("isbn_13"),
                rs.getInt("pages"),
                rs.getLong("review_id"),
                rs.getString("username"),
                rs.getString("review_text"),
                rs.getObject("star_rating", Integer.class),
                rs.getDate("review_date")

        );
    }
}
