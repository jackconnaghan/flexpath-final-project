package org.example.daos;

import org.apache.coyote.Response;
import org.example.exceptions.NoTitleException;
import org.example.models.Review;
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
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.sql.Date;
import java.util.List;

import static org.springframework.http.ResponseEntity.badRequest;

@Component
public class ReviewDao {
    /**
     * JDBC template for querying database.
     */
    private final JdbcTemplate jdbcTemplate;

    /**
     * Set Default vals for a book
     */
    private static final String DEFAULT_USERNAME = "nothing";
    private static final Long DEFAULT_BOOK_ID = 0L;
    private static final String DEFAULT_REVIEW_TEXT = "";
    private static final int DEFAULT_STAR_RATING = 0;
    private static final int minStarRating = 0;
    private static final int maxStarRating = 10;
    private static final Date DEFAULT_REVIEW_DATE =  new Date(19000101);

    /**
     * Create a new book data access object.
     */
    public ReviewDao(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    /**
     * methods for query
     * @return
     */
    public List<Review> getAllReviews() {
        return jdbcTemplate.query("SELECT * FROM reviews;", this::mapToReview);
    }

    public List<Review> getAllReviewsByUser(String username) {
        return jdbcTemplate.query("SELECT * FROM reviews WHERE username = ?", this::mapToReview, username);
    }

    public List<Review> getAllReviewsByBook(String title) {
        return jdbcTemplate.query("SELECT reviews.* FROM reviews JOIN books ON reviews.book_id = books.id WHERE books.title = ?", this::mapToReview, title);
    }
    public Review getReviewByReviewId(Long review_id) {
        try {
            return jdbcTemplate.queryForObject("SELECT * FROM reviews WHERE id=?;", this::mapToReview, review_id);
        } catch (EmptyResultDataAccessException e) {
            e.printStackTrace();
            return null;
        }
    }

    public Review createReview(Review review) {
        String sql = "INSERT INTO reviews (username, book_id, review_text, star_rating, review_date) VALUES (?, ?, ?, ?, ?);";

        if (review.getUsername() == null || isBlank(review.getUsername())) {
            throw new NoTitleException(HttpStatus.BAD_REQUEST, "A review needs a user. Are you logged in?");
        }
        if (ratingIsInvalid(review.getStar_rating())) {
            throw new NoTitleException(HttpStatus.BAD_REQUEST, "A review needs a star rating.");
        }
        if (idIsBlank(review.getBook_id())) {
            throw new NoTitleException(HttpStatus.BAD_REQUEST, "A review needs a book id.");
        }

        /*
         * Set up local vars for passing to jdbcTemplate *
         */
        String username = review.getUsername();
        Long book_id = review.getBook_id();
        String review_text = isBlank(review.getReview_text()) ? DEFAULT_REVIEW_TEXT : review.getReview_text();
        int star_rating = review.getStar_rating();
        Date review_date = reviewDateIsNull(review.getReview_date()) ? DEFAULT_REVIEW_DATE : review.getReview_date();

        KeyHolder keyHolder = new GeneratedKeyHolder();
        try {
            /*
            NEW METHOD:
            1. Use primitive jdbcTemplate.update to enable use of KeyHolder
            2. KeyHolder for capturing id of book added in this instance of
            createBook
             */
            jdbcTemplate.update(connection -> {
                //RETURN_GENERATED_KEYS brings back the ids of all objects created in this
                //update
                PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
                ps.setString(1, username);
                ps.setLong(2, book_id);
                ps.setString(3, review_text);
                ps.setInt(4, star_rating);
                ps.setDate(5, review_date);
                return ps;
            }, keyHolder);

            Number newId = keyHolder.getKey();
            return (newId == null) ? null : getReviewByReviewId(newId.longValue());
            //2. Create ArrayList of all orders in db that have order.username(?)
//            List<Book> books = (ArrayList<Book>) jdbcTemplate.query("SELECT * FROM books ORDER BY id;", this::mapToBook);

//            //3. Return the order with the largest id (which should
//            //point to the most recent order, barring edge cases
//            return books.get(books.size() - 1);
        } catch (DuplicateKeyException e) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "That book already exists.");

        } catch (DataAccessException e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * Private method to check if entries are blank
     */
    private boolean isBlank(String s) {
        return s == null || s.trim().isEmpty() || s.isBlank();
    }

    private boolean ratingIsInvalid(int id) {return id > 10 || id <= 0;}

    private boolean idIsBlank(Long id) {return id != null && id <= 0;}

    private boolean reviewDateIsNull(java.sql.Date review_date) {return review_date == null;}

    public Review updateReviewById(Review review, Long id) {
        //username and book don't change, and I don't want to enter a book's entire info dump
        //on every update if i'm jiust updating one thing. so COMPARE
        Review reviewToUpdate = getReviewByReviewId(id);

        if (reviewToUpdate == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This review does not exist. Try creating a review before updating it.");
        }

        String reviewText;
        if (review.getReview_text() != null) {
            reviewText = review.getReview_text();
        } else {
            reviewText = reviewToUpdate.getReview_text();
        }

        //had to change star_rating to an Integer so it could be checked for null value
        Integer reviewStars;
        if (review.getStar_rating() != null) {
            reviewStars = review.getStar_rating();
        } else if (ratingIsInvalid(review.getStar_rating())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Star rating must be  " + minStarRating + " and " + maxStarRating + ".");
        } else {
            reviewStars = reviewToUpdate.getStar_rating();
        }

        Date reviewDate;
        //currently this allows a user to set a date that comes after the present date...Oopsie poopsie!
        if (review.getReview_date() != null) {
            reviewDate = review.getReview_date();
        } else {
            reviewDate = reviewToUpdate.getReview_date();
        }

        try {
            jdbcTemplate.update("UPDATE reviews SET review_text=?, star_rating=?, review_date=? WHERE id=?",
                    reviewText,
                    reviewStars,
                    reviewDate,
                    id);
            return jdbcTemplate.queryForObject("SELECT * FROM reviews WHERE id=?", this::mapToReview, review.getId());
        } catch (DataAccessException e) {
            e.printStackTrace();
            return null;
        }
    }

    public int deleteReviewById(Long id) {
        try {
            return jdbcTemplate.update("DELETE FROM reviews WHERE id=?", id);
        } catch (DataAccessException e) {
            e.printStackTrace();
            return 0;
        }
    }

    private Review mapToReview(ResultSet rs, int rowNum) throws SQLException {
        return new Review(
                rs.getLong("id"),
                rs.getLong("user_id"),
                rs.getString("username"),
                rs.getLong("book_id"),
                rs.getString("review_text"),
                rs.getInt("star_rating"),
                rs.getDate("review_date")
        );
    }
}
