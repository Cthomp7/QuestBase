package com.questbase.backend.exception;

public class InsufficientPermissionException extends RuntimeException {
    public InsufficientPermissionException() {
        super("You do not have permission to perform this action.");
    }
}