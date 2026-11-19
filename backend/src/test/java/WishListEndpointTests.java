//Regarding ALL Unit tests: I am starting with a basic framework derived from
//the backend module assignment, so this file came from OrderEndpointTests.java in that repo.

import org.example.SpringBootApplication;
import org.example.models.Book;
import org.example.models.WishList;
import org.example.models.WishListBook;
import org.example.models.WishListBookWithReview;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import support.FinalTestConfiguration;
import support.WebStoreTest;

import java.util.List;
import java.util.Map;

import static org.junit.Assert.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertEquals;

/**
 * Tests for the order endpoints.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = SpringBootApplication.class)
@Import(FinalTestConfiguration.class)
public class WishListEndpointTests extends WebStoreTest {
    @Test
    @DisplayName("GET /api/wishlists/mine should return the lists belonging to the logged-in user")
    public void getBooksShouldReturnAllBooks() {
        var requestEntity = GetAuthEntity("user", "admin");
        var result = this.restTemplate.exchange(getBaseUrl() + "/api/wishlists/mine", HttpMethod.GET, requestEntity, WishList[].class);
        var responseCode = result.getStatusCode();
        var wishlists = result.getBody();

        if (wishlists == null) {
            wishlists = new WishList[0];
        }

        assertEquals(HttpStatus.OK, responseCode);
        assertEquals(2, wishlists.length);
    }

    @Test
    @DisplayName("GET /api/wishlists/user/admin will FAIL for users")
    public void getUserWishlistsShouldFailForUsers() {
        var requestEntity = GetAuthEntity("user", "admin");
        var result = this.restTemplate.exchange(getBaseUrl() + "/api/wishlists/user/admin", HttpMethod.GET, requestEntity, String.class);
        var responseCode = result.getStatusCode();
//        var wishlists = result.getBody();

//        if (wishlists == null) {
//            wishlists = new WishList[0];
//        }

        assertEquals(HttpStatus.FORBIDDEN, result.getStatusCode());

    }

    @Test
    @DisplayName("GET /api/wishlists/user/user will SUCCEED for admin")
    public void getUserWishlistAsAdminShouldSucceedForAdmin() {
        var requestEntity = GetAuthEntity("admin", "admin");
        var result = this.restTemplate.exchange(getBaseUrl() + "/api/wishlists/user/user", HttpMethod.GET, requestEntity, WishList[].class);
        var responseCode = result.getStatusCode();


        assertEquals(HttpStatus.OK, responseCode);
//        assertEquals(2, .length);
    }

    @Test
    @DisplayName("POST /api/wishlists/create with WishList obj body should create that WishList at id=4")
    public void createBookShouldCreateBookAtId4() {
        var newWL = new WishList(4L, "user", "my third list!", false);
        var createRequest = GetAuthEntity("user", "admin", newWL);

        var createResult = this.restTemplate.exchange(
                getBaseUrl() + "/api/wishlists/create", HttpMethod.POST, createRequest, WishList.class);

        System.out.println("haiiiii " + createResult.getStatusCode() + " " + createResult.getBody());

        assertEquals(HttpStatus.CREATED, createResult.getStatusCode());

        var created = createResult.getBody();
        Assertions.assertNotNull(created);
        Assertions.assertNotNull(created.getId());
        assertEquals("my third list!", created.getList_title());

    }

    @Test
    @DisplayName("DELETE /api/wishlists/{id} deletes the user's own wishlist")
    public void deleteWishlistShouldDeleteOwnList() {
        var auth = GetAuthEntity("user", "admin");

        var created = this.restTemplate.exchange(getBaseUrl() + "/api/wishlists/create", HttpMethod.POST,
                GetAuthEntity("user", "admin", Map.of("list_title", "my final list")), WishList.class).getBody();
        Assertions.assertNotNull(created);

        var deleteResult = this.restTemplate.exchange(
                getBaseUrl() + "/api/wishlists/" + created.getId(), HttpMethod.DELETE, auth, String.class);
        assertEquals(HttpStatus.OK, deleteResult.getStatusCode());
        assertEquals("1", deleteResult.getBody());

        //Returns FORBIDDEN due to the securities on WishListController
        //Is user ADMIN? No
        //is user owner of id=created.getId()? NO because that id no longer exists
        //The frontend answer for a user would be "you do not own this list."
        var getResult = this.restTemplate.exchange(
                getBaseUrl() + "/api/wishlists/mine/" + created.getId(), HttpMethod.GET, auth, String.class);
        assertEquals(HttpStatus.FORBIDDEN, getResult.getStatusCode());
    }

    /**
     * Below Methods are for adding books to a wishlist
     * Pointing to WishListBookController
     * <p>
     * /api/wishlists/list
     */
    @Test
    @DisplayName("GET /api/wishlists/list/{wishlist_id} returns books in a wishlist + reviews as user")
    public void getBooksShouldReturnBooksAsUser() {
        var auth = GetAuthEntity("user", "admin");
        var getResult = this.restTemplate.exchange(
                getBaseUrl() + "/api/wishlists/list/1", HttpMethod.GET, auth, WishListBookWithReview[].class
        );

        assertEquals(HttpStatus.OK, getResult.getStatusCode());
        assertEquals(2, getResult.getBody().length);
    }

    //come back to this one
//    @Test
//    @DisplayName("POST /api/wishlists/list/{wishlist_id}/add will add book to wishlist")
//    public void addBookToWishListShouldAddBookToWishList() {
//        var bookToAdd = new WishListBook(1, 3, null);
//        var addBookAuth = GetAuthEntity("user", "admin", bookToAdd);
//
//        //create example list
//        var created = this.restTemplate.exchange(getBaseUrl() + "/api/wishlists/create", HttpMethod.POST,
//                GetAuthEntity("user", "admin",
//                        Map.of("list_title", "my final list")),
//                WishList.class).getBody();
//        Assertions.assertNotNull(created);
//
//        var createRequest = this.restTemplate.exchange(
//                getBaseUrl() + "/api/wishlists/list/" + created.getId() + "/add",
//                HttpMethod.POST, addBookAuth, String.class
//        );
////        var createBody = createRequest.getBody();
//        assertEquals(HttpStatus.OK, createRequest.getStatusCode());
//
//        var fetchList = this.restTemplate.exchange(getBaseUrl() + "/api/wishlists/mine", HttpMethod.GET,
//                GetAuthEntity("user", "admin"), WishList[].class).getBody();
//
//        assertEquals(3, fetchList.length);
//        assertEquals(2, fetchList.length);
//    }

//    @Test
//    @DisplayName("DELETE /api/wishlists/list/{wishlist_id} with book_id body will delete book from wishlist")
//    public void deleteBookShouldDeleteBookFromWishlistWithBookId() {
//        var auth = GetAuthEntity("user", "admin");
//        var deleteRequest =
//    }
}