//package org.example.controllers;
//
//import org.example.daos.BookDao;
////import org.example.daos.WishListDao;
//import org.example.models.Book;
//import org.example.models.WishList;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.security.core.Authentication;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
///**
// * Keeping the BookController API public, as I do not care if
// * a non-user accesses the books in the database
// */
//@RestController
////Set it more granular so you can add role and username checks later
////@RequestMapping("/api/wishlists")
//public class WishListController {
//
//    @Autowired
//    private WishListDao wishListDao;
//
//    //Until I implement the chosen authZ and authN method,
//    //this will act as a "getAllWishLists" method
//    @GetMapping(path="/api/wishlists/mine")
////    public List<WishList> getMyWishLists(Authentication a) {return wishListDao.getMyWishLists(a.getName()); }
//    public List<WishList> getMyWishLists() {return wishListDao.getMyWishLists(); }
//
//    //Get book by an ID in the path
//    //Same with getMyWishLists,
//    //Until I implement the chosen authZ and authN method,
//    //this will act as a "getAllWishListsById" method
//    @GetMapping(path = "/api/wishlists/mine/{id}")
////    public WishList getMyWishListsById(Authentication a, @PathVariable Long id) { return wishListDao.getMyWishListById(a.getName(), id); }
//    public WishList getMyWishListsById(@PathVariable Long id) { return wishListDao.getMyWishListById(id); }
//
//
//    /**
//     *
//     * Not a single Book return item because books might have the same title
//     * @param username = title of book
//     * @return = list of books matching that title
//     *
//     */
//    @GetMapping(path = "/api/{username}/wishlists", params = "username")
//    public List<WishList> getWishListByUsername(@RequestParam String username) { return wishListDao.getWishListByUsername(username); }
//
//    @GetMapping(path = "/search-name", params = "name")
//    public List<WishList> getBookByAuthor(@RequestParam String name) {
//        return wishListDao.getWishListsByName(name);
//    }
////commenting for now because I DONT WANT TO FUCK WITH IT RIGHT NOW1111
////    @ResponseStatus(HttpStatus.CREATED)
////    @PostMapping("/create")
//////    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
////    public Book createBook(@RequestBody Book book) { return bookDao.createBook(book); }
////
////    @PutMapping("/update")
//////    @PreAuthorize("hasRole('ADMIN')")
////    public Book updateBook(@RequestBody Book book) { return bookDao.updateBook(book); }
////
////    @DeleteMapping("/{id}")
//////    @PreAuthorize("hasRole('ADMIN')")
////    public int deleteBookById(@PathVariable Long id) {
////        return bookDao.deleteBookById(id);
////    }
//
//}
