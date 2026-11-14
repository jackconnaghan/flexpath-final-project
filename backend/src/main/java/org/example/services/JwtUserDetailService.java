//not needed


//package org.example.services;
//
//import org.example.daos.UserDao;
//import org.example.models.User;
//import org.springframework.security.core.GrantedAuthority;
//import org.springframework.security.core.authority.SimpleGrantedAuthority;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//
//@Service
//public class JwtUserDetailService implements UserDetailsService {
//
//    private final UserDao userDao;
//    public JwtUserDetailService(UserDao userDao) {
//        this.userDao = userDao;
//    }
//
//    @Override
//    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
//        User user = userDao.getUserByUsername(username);
//        if (user == null) {
//            throw new UsernameNotFoundException("No such user: " + username);
//        }
//
//        List<GrantedAuthority> authorities = userDao.getRoles(username)
//                .stream()
//                .map(role -> (GrantedAuthority) new SimpleGrantedAuthority(role))
//                .toList();
//
//    }
//
//
//}
