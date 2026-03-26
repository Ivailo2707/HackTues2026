package com.cm.ecohub.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<Void> handleUserNotFoundException() {
        return ResponseEntity.notFound().build();
    }

    @ExceptionHandler(InvalidTokenException.class)
    public ResponseEntity<Void> handleInvalidTokenException() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
}
