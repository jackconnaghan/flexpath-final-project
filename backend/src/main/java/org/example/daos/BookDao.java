package org.example.daos;

import org.example.models.Book;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

public class BookDao {
    /** JDBC template for querying database.
     *
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

    public Book getBookById(int bookId) {
        try {
            return jdbcTemplate.queryForObject("SELECT * FROM books WHERE id=?;", this::mapToBook, bookId);
        } catch (EmptyResultDataAccessException e) {
            e.printStackTrace();
            return null;
        }
    }

    public Book getBookByName(String bookName) {
        try {
            return jdbcTemplate.queryForObject("SELECT * FROM books WHERE LOWER(title) LIKE '%?%';", this::mapToBook, bookName);
        } catch (EmptyResultDataAccessException e) {
            e.printStackTrace();
            return null;
        }
    }

    public Book createBook(Book book) {
        String sql = "INSERT INTO books (title, author," +
                "pub_year, isbn13, pages) VALUES (?,?,?,?,?);";
        try {
            return jdbcTemplate.update(sql, )
        }
    }

    private Book mapToBook(ResultSet rs, int rowNum) throws SQLException {
        return new Book(
                rs.getString("title"),
                rs.getString("author"),
                rs.getInt("pub_year"),
                rs.getString("isbn13"),
                rs.getInt("pages")
        );
    }
}
