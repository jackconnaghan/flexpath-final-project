//Regarding ALL Unit tests: I am starting with a basic framework derived from
//the backend module assignment, so this file came from OrderEndpointTests.java in that repo.

import org.example.SpringBootApplication;
import org.example.controllers.ReviewController;
import org.example.models.Book;
import org.example.models.Review;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import support.FinalTestConfiguration;
import support.WebStoreTest;

import static org.junit.Assert.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertEquals;

/**
 * Tests for the order endpoints.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = SpringBootApplication.class)
@Import(FinalTestConfiguration.class)
public class ReviewEndpointTests extends WebStoreTest {
    @Test
    @DisplayName("GET /api/reviews/allreviews should return all reviews for admin")
    public void getAllReviewsForAdmin() {
//        var requestEntity = GetAuthEntity("admin", "admin");
        var resultAdmin = this.restTemplate.exchange(getBaseUrl() + "/api/reviews/allreviews",
                HttpMethod.GET, GetAuthEntity("admin", "admin"), Review[].class);
        var resultUser = this.restTemplate.exchange(getBaseUrl() + "/api/reviews/allreviews",
                HttpMethod.GET, GetAuthEntity("user", "admin"), String.class);

//        var responseCode = result.getStatusCode();
//        var books = result.getBody();
        var resultAdminReviews = resultAdmin.getBody();
//        var resultUserReviews = resultUser.getBody();

        System.out.println(resultAdminReviews);
        assertEquals(HttpStatus.OK, resultAdmin.getStatusCode());
        assertEquals(2, resultAdminReviews.length);

        assertEquals(HttpStatus.FORBIDDEN, resultUser.getStatusCode());
    }

    @Test
    @DisplayName("GET /api/reviews/book/{book_id} should return the public reviews for a book with book_id={book_id}")
    public void getPublicReviewsForBook() {
        var requestEntity = GetAuthEntity("user", "admin");
        var result = this.restTemplate.exchange(getBaseUrl() + "/api/reviews/book/1", HttpMethod.GET, requestEntity, Review[].class);
        var responseCode = result.getStatusCode();
        var reviews = result.getBody();

        if (reviews == null) {
            reviews = new Review[0];
        }

        assertEquals(HttpStatus.OK, responseCode);
        assertEquals(0, reviews.length);

        var newResult = this.restTemplate.exchange(getBaseUrl() + "/api/reviews/book/2", HttpMethod.GET, requestEntity, Review[].class);
        System.out.println(newResult.getBody());
        var responseCode2 = newResult.getStatusCode();
        assertEquals(HttpStatus.OK, responseCode2);
        assertEquals(1, newResult.getBody().length);
    }

    @Test
    @DisplayName("POST /api/reviews/create with Review obj body should create review")
    public void createReviewShouldCreateReviewDuh() {
        var newReview = new Review(null, "user", 1L, "That was alright...", 5, null, true);
        var createRequest = GetAuthEntity("user", "admin", newReview);

        var createResult = this.restTemplate.exchange(
                getBaseUrl() + "/api/reviews/create", HttpMethod.POST, createRequest, Review.class);

//        System.out.println("haiiiii " + createResult.getStatusCode() + " " + createResult.getBody());

        assertEquals(HttpStatus.CREATED, createResult.getStatusCode());
        var created = createResult.getBody();
        Assertions.assertNotNull(created);
        Assertions.assertNotNull(created.getId());
        assertEquals("That was alright...", created.getReview_text());

//        var getRequest = GetAuthEntity("admin", "admin");
//        var findResult = this.restTemplate.exchange(
//                getBaseUrl() + "/api/books/search/" + created.getId(), HttpMethod.GET, getRequest, Book.class);
//
//        assertEquals(HttpStatus.OK, findResult.getStatusCode());
//        var found = findResult.getBody();
//        Assertions.assertNotNull(found);
//        assertEquals(created.getId(), found.getId());
//        assertEquals("Nobody Will Remember You", found.getTitle());
    }

    @Test
    @DisplayName("PUT /api/review/update/{review_id} with UpdateReviewRequest body should replace review text")
    public void updateBookShouldFailAsUser() {
        //make review first
        var newReview = new Review(null, "user", 1L, "That was alright...", 5, null, true);
        var createRequest = GetAuthEntity("user", "admin", newReview);

        var createResult = this.restTemplate.exchange(
                getBaseUrl() + "/api/reviews/create", HttpMethod.POST, createRequest, Review.class);

        assertEquals(HttpStatus.CREATED, createResult.getStatusCode());
        //then edit it
        var updatedReview = new ReviewController.UpdateReviewRequest("That was okay!", false);
        var requestEntity = GetAuthEntity("user", "admin", updatedReview);
        var updateResult = this.restTemplate.exchange(
                getBaseUrl() + "/api/reviews/update/" + createResult.getBody().getId(), HttpMethod.PUT, requestEntity, Review.class);

        //"FORBIDDEN": login worked, but you cannot execute the requested action given your roles
        assertEquals(HttpStatus.OK, updateResult.getStatusCode());
        assertEquals("That was okay!", updateResult.getBody().getReview_text());
    }

    @Test
    @DisplayName("DELETE /api/reviews/delete/{review_id} should delete id with id={review_id}")
    public void deleteBookShouldDeleteBookById4() {
        //make review first
        var newReview = new Review(null, "user", 1L, "That was alright...", 5, null, true);
        var createRequest = GetAuthEntity("user", "admin", newReview);

        var createResult = this.restTemplate.exchange(
                getBaseUrl() + "/api/reviews/create", HttpMethod.POST, createRequest, Review.class);

        assertEquals(HttpStatus.CREATED, createResult.getStatusCode());

        var requestEntity = GetAuthEntity("user", "admin");

        var deleteResult = this.restTemplate.exchange(
                getBaseUrl() + "/api/reviews/delete/" + createResult.getBody().getId(), HttpMethod.DELETE, requestEntity, String.class);

        assertEquals(HttpStatus.OK, deleteResult.getStatusCode());
        assertEquals("1", deleteResult.getBody());
    }

}