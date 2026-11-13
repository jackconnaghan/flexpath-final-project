package org.example.config;

import org.example.daos.WishListDao;
import org.example.models.WishList;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component("wishListSecurity")
public class WishListSecurity {

    private final WishListDao wishListDao;

    public WishListSecurity (WishListDao wishListDao) {
        this.wishListDao = wishListDao;
    }

    public boolean isOwner(long wishListId, Authentication auth) {
        WishList wl = wishListDao.getMyWishListById(wishListId);
        return wl != null && wl.getUsername().equals(auth.getName());
    }
}
