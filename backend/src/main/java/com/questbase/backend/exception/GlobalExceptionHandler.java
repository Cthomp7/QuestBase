package com.questbase.backend.exception;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.questbase.backend.exception.auth.EmailAlreadyExistsException;
import com.questbase.backend.exception.auth.InvalidCredentialsException;
import com.questbase.backend.exception.auth.InvalidPasswordException;
import com.questbase.backend.exception.auth.UserNotFoundException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidation(
            MethodArgumentNotValidException ex) {

        String message = ex.getBindingResult()
            .getFieldError()
            .getDefaultMessage();

        return ResponseEntity.badRequest()
            .body(Map.of("message", message));
    }

    @ExceptionHandler(EmailSendException.class)
    public ResponseEntity<Map<String, String>> handleEmailSend(
            EmailSendException ex) {

        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(Map.of("message", ex.getMessage()));
    }
    
    @ExceptionHandler(InsufficientPermissionException.class)
    public ResponseEntity<Map<String, String>> handleInsufficientPermission(
            InsufficientPermissionException ex) {

        return ResponseEntity
            .status(HttpStatus.FORBIDDEN)
            .body(Map.of("message", ex.getMessage()));
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleResourceNotFound(
            ResourceNotFoundException ex) {

        return ResponseEntity
            .status(HttpStatus.NOT_FOUND)
            .body(Map.of("message", ex.getMessage()));
    }

    // =========================================================================
    // AUTH EXCEPTIONS
    // =========================================================================

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<Map<String, String>> handleEmailAlreadyExists(
            EmailAlreadyExistsException ex) {

        return ResponseEntity
            .status(HttpStatus.CONFLICT)
            .body(Map.of("message", ex.getMessage()));
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<Map<String, String>> handleInvalidCredentials(
            InvalidCredentialsException ex) {

        return ResponseEntity
            .status(HttpStatus.UNAUTHORIZED)
            .body(Map.of("message", ex.getMessage()));
    }

    @ExceptionHandler(InvalidPasswordException.class)
    public ResponseEntity<Map<String, String>> handleInvalidPassword(
            InvalidPasswordException ex) {

        return ResponseEntity
            .status(HttpStatus.UNAUTHORIZED)
            .body(Map.of("message", ex.getMessage()));
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleUserNotFound(
            UserNotFoundException ex) {

        return ResponseEntity
            .status(HttpStatus.UNAUTHORIZED)
            .body(Map.of("message", ex.getMessage()));
    }
}