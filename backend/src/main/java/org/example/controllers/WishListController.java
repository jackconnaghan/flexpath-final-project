package org.example.controllers;

import org.example.daos.BookDao;
import org.example.daos.WishListDao;
import org.example.models.Book;
import org.example.models.WishList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Keeping the BookController API public, as I do not care if
 * a non-user accesses the books in the database
 */
@RestController
//Set it more granular so you can add role and username checks later
@RequestMapping("/api/wishlists")
public class WishListController {

    @Autowired
    private WishListDao wishListDao;

    //Until I implement the chosen authZ and authN method,
    //this will act as a "getAllWishLists" method
    //@PreAuthorize("hasRole('ADMIN') or @wishListSecurity.isOwner(#username, authentication)")
    @GetMapping(path="/mine")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN') or wishListSecurity.isOwner(#username, authentication)")
    public List<WishList> getMyWishLists(Authentication a) {return wishListDao.getMyWishLists(a.getName()); }

    //Get book by an ID in the path
    //Same with getMyWishLists,
    //Until I implement the chosen authZ and authN method,
    //this will act as a "getAllWishListsById" method
    @GetMapping(path = "/mine/{id}")
    public WishList getMyWishListsById(Authentication a, @PathVariable Long id) { return wishListDao.getMyWishListById(a.getName(), id); }
    //public WishList getMyWishListsById(@PathVariable Long id) { return wishListDao.getMyWishListById(id); }


    /**
     *
     * Not a single Book return item because books might have the same title
     * @param username = title of book
     * @return = list of books matching that title
     *
     */
    @GetMapping(path = "/api/{username}/wishlists", params = "username")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public List<WishList> getWishListByUsername(@RequestParam String username) { return wishListDao.getWishListByUsername(username); }

//    @GetMapping(path = "/search-name", params = "name")
//    public List<WishList> getWishListByAuthor(@RequestParam String name) {
//        return wishListDao.getWishListsBy(name);
//    }
//commenting for now because I DONT WANT TO FUCK WITH IT RIGHT NOW1111
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/create/{wishlist_title}")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    public WishList createWishList(@PathVariable String wishlist_title, Authentication a) { return wishListDao.createWishList(wishlist_title, a.getName()); }

    @PutMapping("/update")
    @PreAuthorize("hasRole('ADMIN') or @wishListSecurity.isOwner(#username, authentication)")
    public WishList updateWishList(@RequestBody WishList wl, Authentication a) { return wishListDao.updateWishList(wl, a.getName()); }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @wishListSecurity.isOwner(#username, authentication)")
    public int deleteWishListById(@PathVariable Long id, Authentication a) {
        return wishListDao.deleteBookById(id);
    }

}
