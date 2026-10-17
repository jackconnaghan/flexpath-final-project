package org.example.controllers;

import org.example.daos.BookDao;
import org.example.models.Book;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Keeoing the BookController API public, as I do not care if
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
    @GetMapping(path = "/{id}")
    public Book getBookById(@PathVariable Long id) { return bookDao.getBookById(id); }

    @GetMapping()
    public Book getBookByTitle(@RequestBody String title) { return bookDao.getBookByTitle(title); ()}

    @GetMapping()
    public Book getBookByAuthor(@RequestBody String author) {
        return bookDao.getBookByAuthor(author);
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/create")
    @PreAuthorize("hasRole('user')")
    public Book createBook(@RequestBody Book book) { return bookDao.createBook(book); }

    @PutMapping("/update")
    @PreAuthorize("hasRole('user')")
    public Book updateBook(@RequestBody Book book) { return bookDao.updateBook(book); }


}
