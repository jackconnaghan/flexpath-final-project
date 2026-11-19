package org.example.controllers;

import org.example.daos.BookWithReviewDao;
import org.example.daos.ReviewDao;
import org.example.models.BookWithReview;
import org.example.models.Review;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Keeping the BookController API public, as I do not care if
 * a non-user accesses the books in the database
 */
@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewDao reviewDao;

    @Autowired
    private BookWithReviewDao bookWithReviewDao;

//works with updateReviewRequest in ReviewContext
    public record UpdateReviewRequest(String review_text, Boolean is_public) {}

    @GetMapping(path = "/allreviews")
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<Review> getAllReviews() { return reviewDao.getAllReviews(); }

//    @GetMapping(path = "/user/{username}")
//    public List<Review> getAllReviewsByUser(@PathVariable String username) { return reviewDao.getAllReviewsByUser(username); }
    @GetMapping("/book/{bookId}")
    public List<Review> getPublicReviewsForBook(@PathVariable Long bookId) { return reviewDao.getPublicReviewsForBook(bookId); }

    //when a user gets their own reviews, they show up on the My Account page,
    //where the WishLists are not.
    //the SQL query returns a list of BOOKS that
    @GetMapping(path = "/mine")
    @PreAuthorize("isAuthenticated()")
    public List<BookWithReview> getMyBooksWithReview(Authentication auth) { return bookWithReviewDao.getMyBooksWithReviews(auth.getName()); }

    @GetMapping(path = "/searchreviews")
    public List<Review> getAllReviewsByBook(@RequestBody String title) { return reviewDao.getAllReviewsByBook(title); }

    //Get book by an ID in the path
    @GetMapping(path = "/{id}")
    public Review getReviewById(@PathVariable Long id) { return reviewDao.getReviewByReviewId(id); }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/create")
    @PreAuthorize("isAuthenticated()")
    public Review createReview(@RequestBody Review review, Authentication auth) {
        review.setUsername(auth.getName());
        return reviewDao.createReview(review);
    }

    @PutMapping("/update/{review_id}")
    @PreAuthorize("hasAuthority('ADMIN') or @reviewSecurity.isOwner(#review_id, authentication)")
    public Review updateReviewById(@RequestBody UpdateReviewRequest request, @PathVariable Long review_id) {
        return reviewDao.updateReviewById(review_id, request.review_text(), request.is_public());
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or @reviewSecurity.isOwner(#id, authentication)")
    public int deleteReviewById(@PathVariable Long id, Authentication auth) {
        return reviewDao.deleteReviewById(id);
    }

}
