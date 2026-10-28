package org.example.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.authority.mapping.GrantedAuthoritiesMapper;
import org.springframework.security.oauth2.core.user.OAuth2UserAuthority;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;

import java.util.*;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(securedEnabled = true)
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        CsrfTokenRequestAttributeHandler csrfHandler = new CsrfTokenRequestAttributeHandler();
        csrfHandler.setCsrfRequestAttributeName(null);   // set the CSRF cookie on every response
        //the .requestMatchers(Http.GET) + permitAll() methods allows the call included in
        //parentheses to be accessed by anyone, even non-users; basically
        //window shopping the authZ server
        http.authorizeHttpRequests(authZ -> authZ
                        .requestMatchers(HttpMethod.GET, "/api/books/**")
                        .permitAll()
                        .anyRequest()
                        .authenticated())
                //getting in through keycloak via the browster
                .oauth2Login(Customizer.withDefaults())
                //does some bs to allow postman tokens. Remember, refer to
                //application.yaml for more info on where these particular objs are going
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt ->
                                //see method lower down
                                jwt.jwtAuthenticationConverter(jwtAuthenticationConverter())))
                //this next part was a suggestion straight from Claude. I've read the docs on
                // cross-site request forgery, but
                //I have also included Claude's explanation verbatim, as I don't think I can describe it better.
                /* CLAUDE:
                // CSRF protects cookie-based requests. Requests carrying a bearer token
                    // can't be forged by another site (browsers never add that header on
                    // their own), so CSRF is skipped for them. That lets Postman POST/PUT/DELETE.
                 */ //END CLAUDE
                //worst comments ever
                //So, the below code applies a CSRF filter to the end of the filter stack.
                /*
                .csrf takes a lambda function with a csrf object as a param.
                
                 */
                .csrf(csrf -> csrf
                        .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                        .csrfTokenRequestHandler(csrfHandler)
                        .ignoringRequestMatchers(request -> request.getHeader("Authorization") != null));  // Postman bearer tokens still skip it
//                .csrf(csrf -> csrf
//                        .ignoringRequestMatchers(request -> request.getHeader("Authorization") != null));
        return http.build();
    }

    /*
    Lots going on here. This was another concept introduced to me by Claude. I have included my notes
    on this subject here, for ease of reference.
    GrantedAuthoritiesMapper is an interface included in Spring Security
    "which can be injected into the authentication layer to convert the
    authorities loaded from storage into those which will be used by
    the Authentication object (https://docs.spring.io/spring-security/reference/api/java/org/springframework/security/core/authority/mapping/GrantedAuthoritiesMapper.html)."

    Working with Claude, I've tried to further understand the structure of the JWT and
    how its various parts interact. It's presented this data structure after seeing
    the structure that I THOUGHT the JWT was:
    JWT:
        Header:
        Payload: (full of claims)
            sub, exp,... etc.
            preferred_username: "user" and "admin"
            roles: ["USER",...] (which have no ROLE_ prefix)
        Signature (Keycloak private key, verified with public key)
    \/ \/ \/ Spring verifies the signature \/ \/ \/
    \/ \/ \/ The methods in this file change\/ \/ \/
    \/ \/ \/ the structure of the JWT \/ \/ \/
    Authentication:
        principal: (jwt or OidcUser, which hold the claims in the payload
        name: "user" probably
        authorities: [ROLE_USER,...] (we add the ROLE_ prefix)

    GrantedAuthorities are retrieved from a UserDetails interface during authentication process.
    Just know that Keycloak is sending them back as part of the token.

    The two beans below
     */
    @Bean
    public GrantedAuthoritiesMapper rolesMapper() {
        //receive original authorities and make a new set which now includes roles
        return authorities -> {
            //making new HashSet to edit instead of changing authorities directly
            //remember that a HashSet has unique entries, so it's good for keeping duplicate readings of authorities in check
            Set<GrantedAuthority> authoritiesMappedSet = new HashSet<>(authorities);
            //Loop through authorities and find the one that is an instance of OAuth2UserAuthority
            //and instance it to a new variable "oauth2UserAuth"
            for (GrantedAuthority grantedAuthority : authorities) {
                if (grantedAuthority instanceof OAuth2UserAuthority oauth2UserAuth) {
                    //map all attributes of this OAuth2UserAuthority to the HashSet created
                    //and pointed to by the variable authoritiesMappedSet
                    //see additional private methods for toAuthorities and rolesFrom
                    authoritiesMappedSet.addAll(toAuthorities(rolesFrom(oauth2UserAuth.getAttributes())));
                    //getAttributes return's a given user's claims as a Map object for further modification
                }
            }
            return authoritiesMappedSet;
        };
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        //sets the principal name pointed towards the claim called "preferred_username"
        //we'll need the real username for authentication instead of the
        //default subject "sub" claim
        jwtAuthenticationConverter.setPrincipalClaimName("preferred_username");
        //replaces the default method of JwtGrantedAuthoritiesConverter to a custom configuration
        //jwt.getClaims() returns the jwt's contents as a Map of claims
        //rolesFrom(...) extracts
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(jwt -> toAuthorities(rolesFrom(jwt.getClaims())));
        return jwtAuthenticationConverter;
    }

    //private method that fetches roles from a given Map of claims
    private static Collection<String> rolesFrom(Map<String, Object> claims) {
        Object roles = claims.get("roles");
        //see if there's a top-level section for roles.
        //If there's not AND there's a claims.real_access claim on the second level,
        //make roles = the roles level of the realm_access claim
        if (roles == null && claims.get("realm_access") instanceof Map<?, ?> realmAccess) {
            roles = realmAccess.get("roles");
        }
        //Now, if roles is a collection, then return the list as follows:
        //stream it
        //map the objects within (as their String representations)
        //set that Map as a List, then return
        if (roles instanceof Collection<?> list) {
            return list.stream().map(String::valueOf).toList();
        }
        return List.of();
    }

    //prefixes those claims with "ROLE_"
    private static List<GrantedAuthority> toAuthorities(Collection<String> roles) {
        return roles.stream()
                .map(role -> (GrantedAuthority) new SimpleGrantedAuthority("ROLE_" + role))
                .toList();
    }

    //10/23/26
    //admittedly, these extra methods fix a problem that could easily be fixed by
    //changing the names of the roles in Keycloak. So! I'm going to do that eventually.
    /*
    I'm glad I got to learn more about these aspects of the JWT and how to manage its contents.
    It's a subject I didn't quite understand from the Pluralsight modules
    and I enjoyed learning more about the concepts surrounding it.
    I feel like I "get" the JWT and understand how its data gets used.
    I might change the code later and change the Keycloak roles to a
    ROLE_ prefix, but for now I'll keep it this way.
     */


}
