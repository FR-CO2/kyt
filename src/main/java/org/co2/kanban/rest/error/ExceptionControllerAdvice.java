/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.error;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Locale;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.dao.DataAccessException;
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
    protected ResponseEntity handleBuisinessException(BusinessException e) {
        Error result = new Error(ErrorPhase.INPUT_VALIDATION);
        Locale locale = LocaleContextHolder.getLocale();
        String bundleMessage = messageSource.getMessage(e.getMessageKey(), null, locale);
        result.addMessage(new ErrorMessage(bundleMessage));
        return new ResponseEntity<>(result, e.getStatus());
    }

    @ExceptionHandler({DataAccessException.class, SQLException.class})
    protected ResponseEntity handleDatabaseException(Exception e, WebRequest req) {
        logger.error("Request: " + req.getContextPath() + " raised " + e, e);
        Error result = new Error(ErrorPhase.DATA);
        Locale locale = LocaleContextHolder.getLocale();
        String bundleMessage = messageSource.getMessage(DEFAULT_ERROR_MESSAGE_KEY, null, locale);
        result.addMessage(new ErrorMessage(bundleMessage));
        return new ResponseEntity<>(result, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    protected ResponseEntity handleMethodArgumentNotValid(MethodArgumentNotValidException ex, HttpHeaders headers, HttpStatus status, WebRequest request) {
        Locale locale = LocaleContextHolder.getLocale();
        Error result = new Error(ErrorPhase.INPUT_VALIDATION);
        BindingResult validationResult = ex.getBindingResult();
        for (ObjectError error : validationResult.getGlobalErrors()) {
            String bundleMessage = messageSource.getMessage(error.getCode(), null, locale);
            result.addMessage(new ErrorMessage(bundleMessage));
        }
        for (FieldError error : validationResult.getFieldErrors()) {
            String bundleMessage = messageSource.getMessage(error.getCode(), null, locale);
            result.addMessage(new ErrorMessage(bundleMessage, error.getField()));
        }
        return new ResponseEntity<>(result, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler({Exception.class})
    protected ResponseEntity handleUnexpectedException(Exception e, WebRequest req) {
        logger.error("Request: " + req.getContextPath() + " raised " + e, e);
        Error result = new Error(ErrorPhase.UNKNOW);
        Locale locale = LocaleContextHolder.getLocale();
        String bundleMessage = messageSource.getMessage(DEFAULT_ERROR_MESSAGE_KEY, null, locale);
        result.addMessage(new ErrorMessage(bundleMessage));
        return new ResponseEntity<>(result, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    public enum ErrorPhase {

        INPUT_VALIDATION, DATA, UNKNOW
    }

    public static final class Error {

        private final ErrorPhase phase;

        private final List<ErrorMessage> messages = new ArrayList<>();

        public Error(ErrorPhase phase) {
            this.phase = phase;
        }

        public ErrorPhase getPhase() {
            return phase;
        }

        public List<ErrorMessage> getMessages() {
            return this.messages;
        }

        public void addMessage(ErrorMessage msg) {
            this.messages.add(msg);
        }
    }

    public static final class ErrorMessage {

        private final String message;

        private String fieldName;

        public ErrorMessage(String message) {
            this.message = message;
        }

        public ErrorMessage(String message, String fieldName) {
            this.message = message;
            this.fieldName = fieldName;
        }

        public String getMessage() {
            return message;
        }

        public String getFieldName() {
            return fieldName;
        }

    }
}
