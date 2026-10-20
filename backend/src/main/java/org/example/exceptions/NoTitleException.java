package org.example.exceptions;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

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