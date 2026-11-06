package org.example.controllers;

import org.example.daos.WishListBookDao;
import org.example.daos.WishListDao;
import org.example.models.Book;
import org.example.models.WishList;
import org.example.models.WishListBook;
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
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN') or @wishListSecurity.isOwner(#wishlist_id, authentication)")
    public List<Book> getWishListBooksByListId(Authentication a, @PathVariable long wishlist_id) {return wishListBookDao.getWishListBooksByListId(a.getName(), wishlist_id); }


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
//    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
//    public WishList createWishList(@RequestBody WishList wl, Authentication a) { return wishListDao.createWishList(wl, a.getName()); }
//
//    @PutMapping("/update")
//    @PreAuthorize("hasRole('ADMIN') or wishListSecurity.isOwner(#username, authentication")
//    public WishList updateWishList(@RequestBody WishList wl, Authentication a) { return wishListDao.updateWishList(wl, a.getName()); }
//
//    @DeleteMapping("/{id}")
//    @PreAuthorize("hasRole('ADMIN') or wishListSecurity.isOwner(#username, authentication")
//    public int deleteWishListById(@PathVariable Long id, Authentication a) {
//        return wishListDao.deleteBookById(id);
//    }

}
