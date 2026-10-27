package org.example.config;

import org.example.daos.ReviewDao;
import org.example.models.Review;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component("reviewSecurity")
public class ReviewSecurity {

    private final ReviewDao reviewDao;

    public ReviewSecurity(ReviewDao reviewDao) {
        this.reviewDao = reviewDao;
    }

    public boolean isOwner(Long reviewId, Authentication auth) {
        Review review = reviewDao.getReviewByReviewId(reviewId);
        return review != null && review.getUsername().equals(auth.getName());
    }
}
