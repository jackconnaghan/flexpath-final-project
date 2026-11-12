package org.example.controllers;

import org.example.daos.WishListBookDao;
import org.example.daos.WishListDao;
import org.example.models.Book;
import org.example.models.WishList;
import org.example.models.WishListBook;
import org.example.models.WishListBookWithReview;
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
@RequestMapping("/api/wishlists/list")
public class WishListBookController {

    @Autowired
    private WishListBookDao wishListBookDao;

    //Until I implement the chosen authZ and authN method,
    //this will act as a "getAllWishLists" method
    //@PreAuthorize("hasRole('ADMIN') or @wishListSecurity.isOwner(#username, authentication)")
    @GetMapping(path="/{wishlist_id}")
    //user either has to be an admin or have a username that matches the list.
    //if this said "hasAnyRole('ROLE_USER', 'ROLE_ADMIN')" then ANY user would be able to change the
    //lists of any username. Check this on other controllers

    //grabs reviews too now fuck it
    @PreAuthorize("hasRole('ROLE_ADMIN') or @wishListSecurity.isOwner(#wishlist_id, authentication)")
    public List<WishListBookWithReview> getWishListBooksByListId(Authentication a, @PathVariable long wishlist_id) {return wishListBookDao.getWishListBooksByListId(a.getName(), wishlist_id); }


    @PostMapping(path="{wishlist_id}/add")
    @PreAuthorize("hasRole('ROLE_ADMIN') or @wishListSecurity.isOwner(#wishlist_id, authentication)")
    public WishListBook addBookToWishList(@RequestBody long book_id, Authentication a, @PathVariable long wishlist_id) {return wishListBookDao.addBookToWishList(book_id, a.getName(), wishlist_id); }
    //Get book by an ID in the path
    //Same with getMyWishLists,
    //Until I implement the chosen authZ and authN method,
    //this will act as a "getAllWishListsById" method
//    @GetMapping(path = "/mine/{id}")
//    public WishList getMyWishListsById(Authentication a, @PathVariable Long id) { return wishListDao.getMyWishListById(a.getName(), id); }
    //public WishList getMyWishListsById(@PathVariable Long id) { return wishListDao.getMyWishListById(id); }
//
//
//    /**
//     *
//     * Not a single Book return item because books might have the same title
//     * @param username = title of book
//     * @return = list of books matching that title
//     *
//     */
//    //@GetMapping(path = "/api/{username}/wishlists", params = "username")
//    public List<WishList> getWishListByUsername(@RequestParam String username) { return wishListDao.getWishListByUsername(username); }
//
////    @GetMapping(path = "/search-name", params = "name")
////    public List<WishList> getWishListByAuthor(@RequestParam String name) {
////        return wishListDao.getWishListsBy(name);
////    }
////commenting for now because I DONT WANT TO FUCK WITH IT RIGHT NOW1111
//    @ResponseStatus(HttpStatus.CREATED)
//    @PostMapping("/create")
//    @PreAuthorize("hasRole('ADMIN') or @wishListSecurity.isOwner(#wishlist_id, authentication)")
//    public WishList createWishList(@RequestBody WishList wl, Authentication a) { return wishListBookDao.createWishList(wl, a.getName()); }
//
//    @PutMapping("/update")
//    @PreAuthorize("hasRole('ADMIN') or wishListSecurity.isOwner(#username, authentication")
//    public WishList updateWishList(@RequestBody WishList wl, Authentication a) { return wishListDao.updateWishList(wl, a.getName()); }
//
    @DeleteMapping("/{wishlist_id}")
    @PreAuthorize("hasRole('ADMIN') or @wishListSecurity.isOwner(#wishlist_id, authentication)")
    public int deleteWishListBookByListId(@PathVariable Long wishlist_id, Authentication a, @RequestBody Long book_id) {
        return wishListBookDao.deleteWishListBookByListIdAndBookId(wishlist_id, a.getName(), book_id);
    }

}
