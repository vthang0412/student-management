package com.example.studentmanagement.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(
            MethodArgumentNotValidException ex) {

        Map<String, String> errors = new LinkedHashMap<>();

        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.putIfAbsent(
                        error.getField(),
                        error.getDefaultMessage()
                )
        );

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("status", 400);
        body.put("message", "Dữ liệu không hợp lệ");
        body.put("errors", errors);

        return ResponseEntity.badRequest().body(body);
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, Object>> handleStatus(
            ResponseStatusException ex) {

        HttpStatus status = HttpStatus.valueOf(ex.getStatusCode().value());

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("status", status.value());
        body.put("message", ex.getReason());

        return ResponseEntity.status(status).body(body);
    }
}