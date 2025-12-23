package com.finki.icare.exceptions;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class ICareException extends RuntimeException {
    private final HttpStatus status;

    public ICareException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    public static ICareException notFound(String message) {
        return new ICareException(message, HttpStatus.NOT_FOUND);
    }

    public static ICareException forbidden(String message) {
        return new ICareException(message, HttpStatus.FORBIDDEN);
    }

    public static ICareException unauthorized(String message) {
        return new ICareException(message, HttpStatus.UNAUTHORIZED);
    }

    public static ICareException badRequest(String message) {
        return new ICareException(message, HttpStatus.BAD_REQUEST);
    }

    public static ICareException conflict(String message) {
        return new ICareException(message, HttpStatus.CONFLICT);
    }
}
