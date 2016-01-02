/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.error;

import java.util.Locale;
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
public class BusinessExceptionAdvice extends ResponseEntityExceptionHandler {
    
    @Autowired
    private MessageSource messageSource;
    
    
    
    @ExceptionHandler({ BusinessException.class })
    protected ResponseEntity<ErrorMessage> handleBuisinessException(BusinessException e) {
        Locale locale = LocaleContextHolder.getLocale();
        String bundleMessage = messageSource.getMessage(e.getMessageKey(), null, locale);
        ErrorMessage error = new ErrorMessage(bundleMessage, e.getStatus());
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
