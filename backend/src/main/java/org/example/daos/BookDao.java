package org.example.daos;

import org.apache.ibatis.exceptions.TooManyResultsException;
import org.example.exceptions.NoTitleException;
import org.example.exceptions.SameBookException;
import org.example.models.Book;
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
import java.util.List;

import static java.lang.Float.NaN;

@Component
public class BookDao {
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

    /**
     * Create a new book data access object.
     */
    public BookDao(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    public List<Book> getAllBooks() {
        return jdbcTemplate.query("SELECT * FROM books;", this::mapToBook);
    }

    public Book getBookById(Long bookId) {
        try {
            return jdbcTemplate.queryForObject("SELECT * FROM books WHERE id=?;", this::mapToBook, bookId);
        } catch (EmptyResultDataAccessException e) {
            e.printStackTrace();
            return null;
        }
    }

    public List<Book> getBookByTitle(String title) {
        try {
            return jdbcTemplate.query("SELECT * FROM books WHERE LOWER(title) LIKE ?;", this::mapToBook, "%" + title + "%");
        } catch (EmptyResultDataAccessException e) {
            e.printStackTrace();
            return null;
        }
    }

    public List<Book> getBookByAuthor(String author) {
        try {
            return jdbcTemplate.query("SELECT * FROM books WHERE LOWER(author) LIKE ?;", this::mapToBook, "%" + author + "%");
        } catch (EmptyResultDataAccessException e) {
            e.printStackTrace();
            return null;
        }
    }

    public Book createBook(Book book) {
        String sql = "INSERT INTO books (title, author," +
                "pub_year, isbn_13, pages) VALUES (?,?,?,?,?);";

        if (book == null || isBlank(book.getTitle())) {
            throw new NoTitleException(HttpStatus.BAD_REQUEST, "A book needs at least a title.");
        }

//        if(alreadyInDatabase(book))
//            throw new ResponseStatusException(HttpStatus.CONFLICT, "We already have this Book in our database.");

        /*
        Check whether a book with this title + author combo already exists
         */

        /*
         * Set up local vars for passing to jdbcTemplate *
         */
        String title = book.getTitle().trim();
        String author = isBlank(book.getAuthor()) ? DEFAULT_AUTHOR : book.getAuthor().trim();
        int pubYear = (book.getPub_year() <= 0) ? DEFAULT_PUB_YEAR : book.getPub_year();
        int pages = (book.getPages() <= 0) ? DEFAULT_PAGES : book.getPages();
        String isbn13 = isBlank(book.getIsbn13()) ? null : book.getIsbn13().trim();

        KeyHolder keyHolder = new GeneratedKeyHolder();
        try {
//            jdbcTemplate.update(sql,
//                    title, author, pubYear, isbn13, pages, keyHolder);

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
                ps.setString(1, title);
                ps.setString(2, author);
                ps.setInt(3, pubYear);
                ps.setString(4, isbn13);
                ps.setInt(5, pages);
                return ps;
            }, keyHolder);

            Number newId = keyHolder.getKey();
            return (newId == null) ? null : getBookById(newId.longValue());
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

    /**
     * Private method to check if a book
     * with a certain title+author combo
     * is already in the database
     *
     * @param book
     * @return
     */
    private boolean alreadyInDatabase(Book book) {
        String sql = "SELECT * FROM books WHERE title=?";

        ArrayList<Book> books = (ArrayList<Book>) jdbcTemplate.query(sql, this::mapToBook, book.getTitle());

        for (Book book1 : books) {
            if (book1.getAuthor().trim().equalsIgnoreCase(book.getAuthor())) {
                return true;
            }
        }
        return false;
    }

    public Book updateBook(Book book) {
        try {
            //OrderItem tempOrderItem = jdbcTemplate.queryForObject("SELECT * FROM order_items WHERE id = ?", this::mapToOrderItem, orderItem.getId());
            List<Book> booksWithTitle = getBookByTitle(book.getTitle());
            Long id = 0L;
            if (booksWithTitle.size() == 1) {
                id = booksWithTitle.get(0).getId();
            } else {
                throw new TooManyResultsException("There are more books with the same title. Try editing a different book," +
                        "or update a book by id with /api/books/");
            }

            try {

                jdbcTemplate.update("UPDATE books SET title=?, author=?," +
                                "pub_year=?, isbn13=?, pages=? WHERE id=?",
                        book.getTitle(),
                        book.getAuthor(),
                        book.getPub_year(),
                        book.getIsbn13(),
                        book.getPages(),
                        id);
                return jdbcTemplate.queryForObject("SELECT * FROM books WHERE id=?", this::mapToBook, book.getId());
            } catch (DataAccessException e) {
                e.printStackTrace();
                return null;
            }
        } catch (DataAccessException e) {
            e.printStackTrace();
            return null;
        }
    }

    public Book updateBookById(Book book, Long id) {
        try {

            jdbcTemplate.update("UPDATE books SET title=?, author=?," +
                            "pub_year=?, isbn13=?, pages=? WHERE id=?",
                    book.getTitle(),
                    book.getAuthor(),
                    book.getPub_year(),
                    book.getIsbn13(),
                    book.getPages(),
                    id);
            return jdbcTemplate.queryForObject("SELECT * FROM books WHERE id=?", this::mapToBook, book.getId());
        } catch (DataAccessException e) {
            e.printStackTrace();
            return null;
        }
    }

    public int deleteBookById(Long id) {
        try {
            return jdbcTemplate.update("DELETE FROM books WHERE id=?", id);
        } catch (DataAccessException e) {
            e.printStackTrace();
            return 0;
        }
    }

    private Book mapToBook(ResultSet rs, int rowNum) throws SQLException {
        return new Book(
                rs.getLong("id"),
                rs.getString("title"),
                rs.getString("author"),
                rs.getInt("pub_year"),
                rs.getString("isbn_13"),
                rs.getInt("pages")
        );
    }
}
