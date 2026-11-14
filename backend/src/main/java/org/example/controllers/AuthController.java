//deprecated 11/13/2026
//only used with old sessionID framework


//package org.example.controllers;
//
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import org.springframework.http.HttpStatus;
//import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.AuthenticationException;
//import org.springframework.security.core.GrantedAuthority;
//import org.springframework.security.core.context.SecurityContext;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.security.web.context.SecurityContextRepository;
//import org.springframework.security.web.csrf.CsrfToken;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.server.ResponseStatusException;
//
//import java.util.List;
//import java.util.Map;
//
//@RestController
//@RequestMapping("/api/auth")
//public class AuthController {
//
//    //set up and assign AuthenticationManager and SecurityContextRepository
//    //AuthenticationManager
//    private final AuthenticationManager authenticationManager;
//    private final SecurityContextRepository securityContextRepository;
//
//    public AuthController(AuthenticationManager authenticationManager, SecurityContextRepository securityContextRepository) {
//        this.authenticationManager = authenticationManager;
//        this.securityContextRepository = securityContextRepository;
//    }
//
//    /** JSON body for POST /api/auth/login: {"username":"...", "password":"..."} */
//    public record LoginRequest(String username, String password) {}
//
//    /** what React gets back: who's logged in and their roles (without the ROLE_ prefix)*/
//    public record UserInfo(String username, List<String> roles) {}
//
//    /**
//     * GET /api/auth/csrf: call this once before your first POST.
//     * Spring only writes the XSRF-TOKEN cookie when something reads the token, reading it here
//     * does that.
//     */
//    @GetMapping("/csrf")
//    public Map<String, String> csrf(CsrfToken csrfToken) {
//        //set headerName equal to the token's header name, and token equal to the token
//        return Map.of("headerName", csrfToken.getHeaderName(), "token", csrfToken.getToken());
//    }
//
//    /**
//     * POST /api/auth/login checks the password, then stores the logged-in user
//     * in the session.
//     */
//    @PostMapping("/login")
//    public UserInfo login(@RequestBody LoginRequest body,
//                          HttpServletRequest request,
//                          HttpServletResponse response) {
//        Authentication auth;
//
//        try {
//            //asks UserDetailsService for the user, then BCrypt-compares the password
//            auth = authenticationManager.authenticate(
//                    UsernamePasswordAuthenticationToken.unauthenticated(body.username(), body.password()));
//        } catch (AuthenticationException e) {
//            //wrong username/password or account is disabled.
//            //message is the same either way so hackers can't tell the difference
//            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username/password combination");
//        }
//
//        //if a session already existed before login, give it a new ID (prevents "session fixation")
//        if (request.getSession(false) != null) {
//            request.changeSessionId();
//        }
//
//        //Spring Security does not save a manual login. Without the below, the login
//        //succeeds, but the very next request is anonymous again.
//        SecurityContext context = SecurityContextHolder.createEmptyContext();
//        context.setAuthentication(auth);
//        //for the rest of this request \/
//        SecurityContextHolder.setContext(context);
//        //for FUTURE requests \/ (creates the session + JSESSIONID cookie)
//        securityContextRepository.saveContext(context, request, response);
//
//        return toUserInfo(auth);
//    }
//
//    /**
//     * GET /api/auth/me: return the current user,
//     * OR 401 if not logged in(anyRequest.authenticated()).
//     */
//    @GetMapping("/me")
//    public UserInfo me(Authentication auth) {
//        return toUserInfo(auth);
//    }
//
//    private UserInfo toUserInfo(Authentication auth) {
//        List<String> roles = auth.getAuthorities().stream()
//                .map(GrantedAuthority::getAuthority) //like ROLE_ADMIN
////                .filter(a -> a.startsWith("ROLE_"))
////                .map(a -> a.substring("ROLE_".length())) //turns ROLE_ADMIN into ADMIN
//                .toList();
//        return new UserInfo(auth.getName(), roles);
//    }
//
//
//}
