package com.questbase.backend.exception;

public class CustomIllegalStateException extends RuntimeException {
    public CustomIllegalStateException(String message) {
        super(message);
    }
}
