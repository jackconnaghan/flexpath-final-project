package org.example.exceptions;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

/**
 * DONT USE THIS BECAUSE I DONT YET UNDERSTAND IT
 * 10/20/2026
 */
public class SameBookException extends ResponseStatusException {

    private final String url;

    public SameBookException(String message) {
        super(HttpStatus.CONFLICT);
        this.url = message;
    }

    @Override
    public HttpHeaders getResponseHeaders() {
        HttpHeaders headers = new HttpHeaders();

        headers.add(HttpHeaders.LOCATION, url);

        return headers;
    }
}