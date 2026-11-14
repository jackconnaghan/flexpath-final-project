package org.example.daos;

import org.example.exceptions.DaoException;
import org.example.models.User;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import javax.sql.DataSource;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

/**
 * Data access object for users.
 */
@Component
public class UserDao {
    /**
     * The JDBC template for querying the database.
     */
    private final JdbcTemplate jdbcTemplate;

    /**
     * The password encoder for the DAO.
     */
    private final PasswordEncoder passwordEncoder;

    /**
     * Creates a new user data access object.
     *
     * @param dataSource      The data source for the DAO.
     * @param passwordEncoder The password encoder for the DAO.
     */
    public UserDao(DataSource dataSource, PasswordEncoder passwordEncoder) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Gets all users.
     *
     * @return List of User
     */
    public List<User> getUsers() {
        return jdbcTemplate.query("SELECT * FROM users ORDER BY username;", this::mapToUser);
    }

    /**
     * Gets a user by username.
     *
     * @param username The username of the user.
     * @return User
     */
    public User getUserByUsername(String username) {
        try {
            return jdbcTemplate.queryForObject("SELECT * FROM users WHERE username = ?", this::mapToUser, username);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    /**
     * Creates a new user.
     *
     * @param user The user to create.
     * @return User The created user.
     */
    /*
    So THIS is fun: @Transactional makes a methods jdbcTemplate calls either ALL run, or NONE.
    Will keep a user from getting created without also having a role set.
     */
    @Transactional
    public User createUser(User user) {
        String hashedPassword = passwordEncoder.encode(user.getPassword());
        String sql = "INSERT INTO users (username, password) VALUES (?,?);";
        String rolesSql = "INSERT INTO roles (username, role) VALUES (?,?);";
        try {
            jdbcTemplate.update(sql, user.getUsername(), hashedPassword);
            jdbcTemplate.update(rolesSql, user.getUsername(), "USER");

        } catch (DuplicateKeyException e) {
            throw new DaoException("Username already exists.");
        }
        return getUserByUsername(user.getUsername());
    }

    /**
     * Updates a user's password.
     *
     * @param user The user to update.
     * @return User
     */
    public User updatePassword(User user) {
        String hashedPassword = passwordEncoder.encode(user.getPassword());
        String sql = "UPDATE users SET password = ? WHERE username = ?";
        int rowsAffected = jdbcTemplate.update(sql, hashedPassword, user.getUsername());
        if (rowsAffected == 0) {
            throw new DaoException("Zero rows affected, expected at least one.");
        } else {
            return getUserByUsername(user.getUsername());
        }
    }

    /**
     * Deletes a user.
     *
     * @param username The username of the user.
     */
    @Transactional
    public int deleteUser(String username) {
        String sql = "DELETE FROM users WHERE username = ? ";

        jdbcTemplate.update(
                "DELETE FROM wishlist_books WHERE wishlist_id IN " +
                        "(SELECT id FROM wishlists WHERE username = ?)",
                username);
        jdbcTemplate.update("DELETE FROM wishlists WHERE username = ?", username);
        jdbcTemplate.update("DELETE FROM reviews WHERE username = ?", username);
        jdbcTemplate.update("DELETE FROM roles WHERE username = ?", username);

        return jdbcTemplate.update(sql, username);

        /*
        Add a test for it. Your test database has users with reviews and wishlists,
        so “delete a user who has reviews and a wishlist,
        then check that their rows are gone from every table”
        is a strong endpoint test. It’s also the best proof that
        the transaction and the deletion order both work.
         */
    }

    /**
     * Gets all roles for a user.
     *
     * @param username The username of the user.
     * @return List of String
     */
    public List<String> getRoles(String username) {
        return jdbcTemplate.queryForList("SELECT role FROM roles WHERE username = ?;", String.class, username);
    }

    /**
     * Adds a role to a user.
     *
     * @param username The username of the user.
     * @param role     The role to add.
     * @return List of String
     */
    public List<String> addRole(String username, String role) {
        try {
            String sql = "INSERT INTO roles (username, role) VALUES (?,?)";
            jdbcTemplate.update(sql, username, role);
        } catch (DataAccessException e) {
        }
        return getRoles(username);
    }

    /**
     * Deletes a role from a user.
     *
     * @param username The username of the user.
     * @param role     The role to delete.
     */
    public int deleteRole(String username, String role) {
        String sql = "DELETE FROM roles WHERE username = ? AND role = ?";
        return jdbcTemplate.update(sql, username, role);
    }

    /**
     * Maps a row in the ResultSet to a User object.
     *
     * @param resultSet The result set to map.
     * @param rowNumber The row number.
     * @return User The user object.
     * @throws SQLException If an error occurs while mapping the result set.
     */
    private User mapToUser(ResultSet resultSet, int rowNumber) throws SQLException {
        String username = resultSet.getString("username");
        return new User(
                username,
                resultSet.getString("password")
        );
    }
}
