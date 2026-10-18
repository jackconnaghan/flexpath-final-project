package org.example.daos;

import org.example.models.Book;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import javax.sql.DataSource;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Component
public class BookDao {
    /**
     * JDBC template for querying database.
     */
    private final JdbcTemplate jdbcTemplate;

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
                "pub_year, isbn13, pages) VALUES (?,?,?,?,?);";
        try {
            jdbcTemplate.update(sql,
                    book.getTitle(),
                    book.getAuthor(),
                    book.getPub_year(),
                    book.getIsbn13(),
                    book.getPages());

            //2. Create ArrayList of all orders in db that have order.username(?)
            List<Book> books = (ArrayList<Book>) jdbcTemplate.query("SELECT * FROM books ORDER BY id;", this::mapToBook);
            //3. Return the order with the largest id (which should
            //point to the most recent order, barring edge cases
            return books.get(books.size() - 1);
        } catch (DataAccessException e) {
            e.printStackTrace();
            return null;
        }
    }

    public Book updateBook(Book book) {
        try {
            //OrderItem tempOrderItem = jdbcTemplate.queryForObject("SELECT * FROM order_items WHERE id = ?", this::mapToOrderItem, orderItem.getId());
            jdbcTemplate.update("UPDATE books SET title=?, author=?," +
                            "pub_year=?, isbn13=?, pages=? WHERE id=?",
                    book.getTitle(),
                    book.getAuthor(),
                    book.getPub_year(),
                    book.getIsbn13(),
                    book.getPages());
            return jdbcTemplate.queryForObject("SELECT * FROM books WHERE id=?", this::mapToBook, book.getId());
        }  catch (DataAccessException e) {
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
                rs.getString("isbn13"),
                rs.getInt("pages")
        );
    }
}
