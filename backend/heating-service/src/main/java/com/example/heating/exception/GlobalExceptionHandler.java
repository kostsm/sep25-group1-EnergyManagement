package com.example.heating.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(HeatingException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public String handle(HeatingException ex) {
        return ex.getMessage();
    }
}
