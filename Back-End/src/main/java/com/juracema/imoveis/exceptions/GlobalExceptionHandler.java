package com.juracema.imoveis.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    /*
     * 401 - Credenciais inválidas
     */

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentials(
            BadCredentialsException ex
    ) {

        ErrorResponse response =
                new ErrorResponse(
                        HttpStatus.UNAUTHORIZED.value(),
                        ex.getMessage(),
                        null
                );

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(response);
    }


    /*
     * 404 - Recurso não encontrado
     */

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(
            ResourceNotFoundException ex
    ) {

        ErrorResponse response =
                new ErrorResponse(
                        HttpStatus.NOT_FOUND.value(),
                        ex.getMessage(),
                        null
                );

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(response);
    }


    /*
     * 400 - Erros de validação
     */

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(
            MethodArgumentNotValidException ex
    ) {

        Map<String, String> errors =
                new HashMap<>();

        ex.getBindingResult()
                .getFieldErrors()
                .forEach(error ->
                        errors.put(
                                error.getField(),
                                error.getDefaultMessage()
                        )
                );


        ErrorResponse response =
                new ErrorResponse(
                        HttpStatus.BAD_REQUEST.value(),
                        "Dados inválidos",
                        errors
                );


        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(response);
    }
}