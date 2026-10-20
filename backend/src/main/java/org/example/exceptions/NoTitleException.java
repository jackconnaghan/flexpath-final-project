package org.example.exceptions;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

@ResponseStatus(code = HttpStatus.BAD_REQUEST, reason = "Book needs at least a title.")
public class NoTitleException extends ResponseStatusException {

    private final String message;

    public NoTitleException(String message) {
        super(HttpStatus.BAD_REQUEST, message);
        this.message = message;
    }

    public NoTitleException(HttpStatus status, String message) {
        super(status, message);
        this.message = message;
    }

    @Override
    public HttpHeaders getResponseHeaders() {
        HttpHeaders headers = new HttpHeaders();
        if (message != null) {
            headers.add(HttpHeaders.LOCATION, message);
        }
        return headers;
    }
}