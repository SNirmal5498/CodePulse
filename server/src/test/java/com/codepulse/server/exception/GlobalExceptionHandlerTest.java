package com.codepulse.server.exception;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler =
            new GlobalExceptionHandler();

    @Test
    void shouldHandleValidationException() {

        MethodArgumentNotValidException exception =
                mock(MethodArgumentNotValidException.class);

        BindingResult bindingResult =
                mock(BindingResult.class);

        FieldError fieldError =
                new FieldError(
                        "registerRequest",
                        "email",
                        "Email is required"
                );

        when(exception.getBindingResult())
                .thenReturn(bindingResult);

        when(bindingResult.getFieldErrors())
                .thenReturn(List.of(fieldError));

        var response =
                handler.handleValidationException(exception);

        assertEquals(
                HttpStatus.BAD_REQUEST,
                response.getStatusCode()
        );

        assertNotNull(response.getBody());

        assertEquals(
                "Validation failed",
                response.getBody().get("error")
        );

        Object fieldsObject = response.getBody().get("fields");

        assertInstanceOf(Map.class, fieldsObject);

        Map<?, ?> fields = (Map<?, ?>) fieldsObject;

        assertEquals(
        "Email is required",
        fields.get("email")
);
    }

    @Test
    void shouldHandleRuntimeException() {

        RuntimeException exception =
                new RuntimeException("Something went wrong");

        var response =
                handler.handleRuntimeException(exception);

        assertEquals(
                HttpStatus.BAD_REQUEST,
                response.getStatusCode()
        );

        assertNotNull(response.getBody());

        assertEquals(
                "Request failed",
                response.getBody().get("error")
        );

        assertEquals(
                "Something went wrong",
                response.getBody().get("message")
        );
    }
}