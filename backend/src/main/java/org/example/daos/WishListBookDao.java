package org.example.daos;

import org.example.models.Book;
import org.example.models.WishList;
import org.example.models.WishListBook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.List;

@Component
public class WishListBookDao {
    /**
     * JDBC template for querying database.
     */
    private final JdbcTemplate jdbcTemplate;
    //private String username;


    /**
     * This will NEVER have defaults because
     * wishlistbooks will always point to a book
     * and a wishlist that already exist
     */

    //private static final String DEFAULT_NAME = "untitled list";
    @Autowired

    /**
     * Create a new wishlist data access object.
     */
    public WishListBookDao(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    public List<WishListBook> getWishListBooks() {
        return jdbcTemplate.query("SELECT * FROM wishlist_books;", this::mapToWishListBook);
    }
    ///
    //Making new thingies from scratch
    //because this one takes a lot of joins
    public List<Book> getWishListBooksByListId(String username, long wishlist_id) {
        try {
            return jdbcTemplate.query("SELECT books.* " +
                    "FROM books " +
                    "JOIN wishlist_books ON books.id = wishlist_books.book_id " +
                    "JOIN wishlists ON wishlist_books.wishlist_id = wishlists.id " +
                    "WHERE wishlist_books.wishlist_id = ? AND username = ?",
                    this::mapToBook, wishlist_id, username);
        } catch (EmptyResultDataAccessException e) {
            e.printStackTrace();
            return null;
        }
    }




    ///

//    public WishList getMyWishListById(String username, Long wishListId) {
//        //this.username = username;
//        try {
//            return jdbcTemplate.queryForObject("SELECT * FROM wishlists WHERE username=? AND id=?;", this::mapToWishList, username, wishListId);
//        } catch (EmptyResultDataAccessException e) {
//            e.printStackTrace();
//            return null;
//        }
//    }
//
//    /**
//     * TEMPORARY
//     * Until AuthZ and AuthN is implemented; then, use above
//     * @return
//     */
//    public List<WishList> getMyWishLists() {
//        return jdbcTemplate.query("SELECT * FROM wishlists ORDER ASC;", this::mapToWishList);
//    }
//
//    public WishList getMyWishListById(Long wishListId) {
//        //this.username = username;
//        try {
//            return jdbcTemplate.queryForObject("SELECT * FROM wishlists WHERE id=?;", this::mapToWishList, wishListId);
//        } catch (EmptyResultDataAccessException e) {
//            e.printStackTrace();
//            return null;
//        }
//    }
//
//    public List<WishList> getWishListsByTitle(String list_title) {
//        try {
//            return jdbcTemplate.query("SELECT * FROM wishlists WHERE LOWER(list_title) LIKE ?;", this::mapToWishList, "%" + list_title + "%");
//        } catch (EmptyResultDataAccessException e) {
//            e.printStackTrace();
//            return null;
//        }
//    }
//
//    public List<WishList> getWishListByUsername(String username) {
//        try {
//            return jdbcTemplate.query("SELECT * FROM wishlists WHERE LOWER(username) LIKE ?;", this::mapToWishList, "%" + username + "%");
//        } catch (EmptyResultDataAccessException e) {
//            e.printStackTrace();
//            return null;
//        }
//    }
//
//    public WishList createWishList(WishList wishList, String username) {
//        String sql = "INSERT INTO wishlists (username, list_title) VALUES (?, ?);";
//
////        if (book == null || isBlank(book.getTitle())) {
////            throw new NoTitleException(HttpStatus.BAD_REQUEST, "A book needs at least a title.");
////        }
//
////        if(alreadyInDatabase(book))
////            throw new ResponseStatusException(HttpStatus.CONFLICT, "We already have this Book in our database.");
//
//        /*
//        Check whether a book with this title + author combo already exists
//         */
//
//        /*
//        Grab list title from the request body
//         */
//        String list_title = isBlank(wishList.getList_title().trim()) ? DEFAULT_NAME : wishList.getList_title().trim();
//
//        KeyHolder keyHolder = new GeneratedKeyHolder();
//        try {
//            /*
//            NEW METHOD:
//            1. Use primitive jdbcTemplate.update to enable use of KeyHolder
//            2. KeyHolder for capturing id of book added in this instance of
//            createBook
//             */
//            jdbcTemplate.update(connection -> {
//                //RETURN_GENERATED_KEYS brings back the ids of all objects created in this
//                //update
//                PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
//                ps.setString(1, username);
//                ps.setString(2, list_title);
//                return ps;
//            }, keyHolder);
//
//            Number newId = keyHolder.getKey();
////            return (newId == null) ? null : getMyWishListById(username, newId.longValue());
//            /**
//             * TEMPORARY
//             * Until AuthZ and AuthN
//             * Then, use above
//             */
//            return (newId == null) ? null : getMyWishListById(newId.longValue());
//            //2. Create ArrayList of all orders in db that have order.username(?)
////            List<Book> books = (ArrayList<Book>) jdbcTemplate.query("SELECT * FROM books ORDER BY id;", this::mapToBook);
//
//
////            //3. Return the order with the largest id (which should
////            //point to the most recent order, barring edge cases
////            return books.get(books.size() - 1);
////        } catch (DuplicateKeyException e) {
////            throw new ResponseStatusException(HttpStatus.CONFLICT, "That book already exists.");
//
//        } catch (DataAccessException e) {
//            e.printStackTrace();
//            return null;
//        }
//    }
//
//    /**
//     * Private method to check if entries are blank
//     */
//    private boolean isBlank(String s) {
//        return s == null || s.trim().isEmpty() || s.isBlank();
//    }
////
////    /**
////     * Private method to check if a book
////     * with a certain title+author combo
////     * is already in the database
////     * @param book
////     * @return
////     */
////    private boolean alreadyInDatabase(Book book) {
////        String sql = "SELECT * FROM books WHERE title=?";
////
////        ArrayList<Book> books = (ArrayList<Book>) jdbcTemplate.query(sql, this::mapToBook, book.getTitle());
////
////        for (Book book1 : books) {
////            if (book1.getAuthor().trim().equalsIgnoreCase(book.getAuthor())) {
////                return true;
////            }
////        }
////        return false;
////    }
//
//    public WishList updateWishList(WishList wl, String username) {
//
//        KeyHolder keyHolder = new GeneratedKeyHolder();
//        String sql = "UPDATE wishlists SET username=?, list_title=? WHERE id=?;";
//
//        try {
//            //OrderItem tempOrderItem = jdbcTemplate.queryForObject("SELECT * FROM order_items WHERE id = ?", this::mapToOrderItem, orderItem.getId());
//            jdbcTemplate.update(connection -> {
//                //RETURN_GENERATED_KEYS brings back the ids of all objects created in this
//                //update
//                PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
//                ps.setString(1, wl.getUsername());
//                ps.setString(2, wl.getUsername());
//                return ps;
//            }, keyHolder);
//            return jdbcTemplate.queryForObject("SELECT * FROM wishlists WHERE id=?", this::mapToWishList, wl.getId());
//        }  catch (DataAccessException e) {
//            e.printStackTrace();
//            return null;
//        }
//
//    }
//
//    public int deleteBookById(Long id) {
//        try {
//            return jdbcTemplate.update("DELETE FROM wishlist_books WHERE id=?", id);
//        } catch (DataAccessException e) {
//            e.printStackTrace();
//            return 0;
//        }
//    }

    private WishListBook mapToWishListBook(ResultSet rs, int rowNum) throws SQLException {
        return new WishListBook(
                rs.getLong("wishlist_id"),
                rs.getLong("book_id"),
                rs.getDate("time_added")
        );
    }

    //put the mapToBook function in, as the usual behavior of the WishListBooks API will return books by title, author, etc.
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
