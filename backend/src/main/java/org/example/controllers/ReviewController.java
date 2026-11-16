package org.example.controllers;

import org.example.daos.ReviewDao;
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

    @GetMapping(path = "/allreviews")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Review> getAllReviews() { return reviewDao.getAllReviews(); }

//    @GetMapping(path = "/user/{username}")
//    public List<Review> getAllReviewsByUser(@PathVariable String username) { return reviewDao.getAllReviewsByUser(username); }

    @GetMapping("/book/{bookId}")
    public List<Review> getPublicReviewsForBook(@PathVariable Long bookId) { return reviewDao.getPublicReviewsForBook(bookId); }

    @GetMapping(path = "/mine")
    @PreAuthorize("isAuthenticated()")
    public List<Review> getMyReviews(Authentication auth) { return reviewDao.getMyReviews(auth.getName()); }

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

    @ResponseStatus(HttpStatus.OK)
    @PutMapping("/update/{review_id}")
    @PreAuthorize("hasRole('ADMIN') or @reviewSecurity.isOwner(#review_id, authentication)")
    public Review updateReviewById(@RequestBody String review_text, @PathVariable Long review_id, Authentication auth) {

        return reviewDao.updateReviewById(review_text, review_id);
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ADMIN') or @reviewSecurity.isOwner(#id, authentication)")
    public int deleteReviewById(@PathVariable Long id, Authentication auth) {
        return reviewDao.deleteReviewById(id);
    }

}
