/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.error;

import java.util.Locale;
import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
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

    @ExceptionHandler({Exception.class})
    protected ResponseEntity<ErrorMessage> handleException(HttpServletRequest req, Exception e) {
        logger.error("Request: " + req.getRequestURL() + " raised " + e);
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
