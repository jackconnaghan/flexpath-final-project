package org.example.controllers;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/*
----------NOTICE----------
This ProfileController class has been changed from the seed project.
It now makes a basic login request so users can log in to their account and
have their creds checked before adding a book to the database.
 */
@RestController
@RequestMapping("/api")
public class ProfileController {

    //Return usernames and roles of a user. 401
    @GetMapping("/me")
    public Map<String, Object> me(Authentication auth) {
        List<String> roles = auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .filter(a -> a.startsWith("ROLE_"))
                .map(a -> a.substring("ROLE_".length()))   // "ROLE_USER" -> "USER"
                .toList();

        return Map.of(
                "username", auth.getName(),   // preferred_username, via user-name-attribute
                "roles", roles
        );
    }
}
