package org.example.controllers;

import org.example.daos.BookDao;
import org.example.models.Book;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Keeping the BookController API public, as I do not care if
 * a non-user accesses the books in the database
 */
@RestController
@RequestMapping("/api/books")
public class BookController {

    @Autowired
    private BookDao bookDao;

    @GetMapping
    public List<Book> getAllBooks() { return bookDao.getAllBooks(); }

    //Get book by an ID in the path
    @GetMapping(path = "/search/{id}")
    public Book getBookById(@PathVariable Long id) { return bookDao.getBookById(id); }

    /**
     *
     * Not a single Book return item because books might have the same title
     * @param title = title of book
     * @return = list of books matching that title
     *
     */
    @GetMapping(path = "/search", params = "title")
    public List<Book> getBookByTitle(@RequestParam String title) { return bookDao.getBookByTitle(title); }

    @GetMapping(path = "/search", params = "author")
    public List<Book> getBookByAuthor(@RequestParam String author) {
        return bookDao.getBookByAuthor(author);
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/create")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public Book createBook(@RequestBody Book book) { return bookDao.createBook(book); }

    @PutMapping("/update")
    @PreAuthorize("hasRole('ADMIN')")
    public Book updateBook(@RequestBody Book book) { return bookDao.updateBook(book); }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public int deleteBookById(@PathVariable Long id) {
        return bookDao.deleteBookById(id);
    }

}
