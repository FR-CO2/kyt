/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.error;

import org.springframework.http.HttpStatus;

/**
 *
 * @author ben
 */
public class BusinessException extends RuntimeException {
    private static final long serialVersionUID = -8778092486194952797L;

    private final HttpStatus status;
    
    private final String messageKey;
    
    public BusinessException(HttpStatus status, String messageKey) {
        this.messageKey = messageKey;
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public String getMessageKey() {
        return messageKey;
    }
    
}
