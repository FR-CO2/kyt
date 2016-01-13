/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.error;

import java.util.ArrayList;
import java.util.Locale;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

/**
 *
 * @author ben
 */
@ControllerAdvice
public class ExceptionControllerAdvice extends ResponseEntityExceptionHandler {

    private static final String DEFAULT_ERROR_MESSAGE_KEY = "error.unexpected";

    @Autowired
    private MessageSource messageSource;

    @ExceptionHandler({BusinessException.class})
    protected ResponseEntity<ErrorMessage> handleBuisinessException(BusinessException e) {
        Locale locale = LocaleContextHolder.getLocale();
        String bundleMessage = messageSource.getMessage(e.getMessageKey(), null, locale);
        ErrorMessage error = new ErrorMessage(bundleMessage, e.getStatus());
        return new ResponseEntity<>(error, error.getStatus());
    }

    @Override
    protected ResponseEntity handleMethodArgumentNotValid(MethodArgumentNotValidException ex, HttpHeaders headers, HttpStatus status, WebRequest request) {
        Locale locale = LocaleContextHolder.getLocale();
        List<ErrorMessage> errors = new ArrayList<>();
        BindingResult result = ex.getBindingResult();
        for (ObjectError error : result.getAllErrors()) {
            String bundleMessage = messageSource.getMessage(error.getCode(), null, locale);
            errors.add(new ErrorMessage(bundleMessage, HttpStatus.BAD_REQUEST));
        }
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler({Exception.class})
    protected ResponseEntity<ErrorMessage> handleUnexpectedException(Exception e, WebRequest req) {
        logger.error("Request: " + req.getContextPath() + " raised " + e);
        Locale locale = LocaleContextHolder.getLocale();
        String bundleMessage = messageSource.getMessage(DEFAULT_ERROR_MESSAGE_KEY, null, locale);
        ErrorMessage error = new ErrorMessage(bundleMessage, HttpStatus.INTERNAL_SERVER_ERROR);
        return new ResponseEntity<>(error, error.getStatus());
    }

    public static final class ErrorMessage {

        private final String message;

        private final HttpStatus status;

        public ErrorMessage(String message, HttpStatus status) {
            this.message = message;
            this.status = status;
        }

        public String getMessage() {
            return message;
        }

        public HttpStatus getStatus() {
            return status;
        }

    }
}
