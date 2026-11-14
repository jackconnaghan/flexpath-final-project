//Regarding ALL Unit tests: I am starting with a basic framework derived from
//the backend module assignment, so this file came from OrderEndpointTests.java in that repo.

import org.example.SpringBootApplication;
import org.example.models.Book;
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

import static org.junit.Assert.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertEquals;

/**
 * Tests for the order endpoints.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = SpringBootApplication.class)
@Import(FinalTestConfiguration.class)
public class BookEndpointTests extends WebStoreTest {
    @Test
    @DisplayName("GET /api/books should return all orders")
    public void getBooksShouldReturnAllBooks() {
        var requestEntity = GetAuthEntity("admin", "admin");
        var result = this.restTemplate.exchange(getBaseUrl() + "/api/books", HttpMethod.GET, requestEntity, Book[].class);
        var responseCode = result.getStatusCode();
        var books = result.getBody();

        if (books == null) {
            books = new Book[0];
        }

        assertEquals(HttpStatus.OK, responseCode);
        assertEquals(3, books.length);
    }

    @Test
    @DisplayName("GET /api/books/search/2 should return a book with ID of 2")
    public void getBooksShouldReturnBookOfId1() {
        var requestEntity = GetAuthEntity("admin", "admin");
        var result = this.restTemplate.exchange(getBaseUrl() + "/api/books/search/2", HttpMethod.GET, requestEntity, Book.class);
        var responseCode = result.getStatusCode();
        var book = result.getBody();

        if (book == null) {
            book = new Book();
        }

        assertEquals(HttpStatus.OK, responseCode);
        assertEquals(2, book.getId());
    }

    @Test
    @DisplayName("GET /api/books/search with RequestParams title and author should return books matching those keywords, even with incomplete title/author")
    public void getBooksWithTitleAndAuthorShouldReturnBookWithTitleAndAuthor() {
        var requestEntity = GetAuthEntity("admin", "admin");
        var result = this.restTemplate.exchange(getBaseUrl() + "/api/books/search?title=great&author=colum", HttpMethod.GET, requestEntity, Book[].class);
        var responseCode = result.getStatusCode();
        var books = result.getBody();

        if (books == null) {
            books = new Book[0];
        }

        assertEquals(HttpStatus.OK, responseCode);
        assertEquals(1, books.length);
        assertEquals("Let The Great World Spin", books[0].getTitle());
    }

    @Test
    @DisplayName("POST /api/books/create with Book obj body should create that book at id=4")
    public void createBookShouldCreateBookAtId4() {
        var newBook = new Book(null, "Nobody Will Remember You", "Ariana Grande", 1981, "193491", 99);
        var createRequest = GetAuthEntity("admin", "admin", newBook);

        var createResult = this.restTemplate.exchange(
                getBaseUrl() + "/api/books/create", HttpMethod.POST, createRequest, Book.class);

        System.out.println("haiiiii " + createResult.getStatusCode() + " " + createResult.getBody());

        assertEquals(HttpStatus.CREATED, createResult.getStatusCode());
        var created = createResult.getBody();
        Assertions.assertNotNull(created);
        Assertions.assertNotNull(created.getId());
        assertEquals("Nobody Will Remember You", created.getTitle());

        var getRequest = GetAuthEntity("admin", "admin");
        var findResult = this.restTemplate.exchange(
                getBaseUrl() + "/api/books/search/" + created.getId(), HttpMethod.GET, getRequest, Book.class);

        assertEquals(HttpStatus.OK, findResult.getStatusCode());
        var found = findResult.getBody();
        Assertions.assertNotNull(found);
        assertEquals(created.getId(), found.getId());
        assertEquals("Nobody Will Remember You", found.getTitle());
    }

}