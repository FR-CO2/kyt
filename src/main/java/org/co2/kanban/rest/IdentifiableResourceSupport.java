/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.co2.kanban.repository.Identifiable;
import org.springframework.hateoas.ResourceSupport;

/**
 *
 * @author ben
 * @param <T> bean implements identifiable
 */
public abstract class IdentifiableResourceSupport <T extends Identifiable> extends ResourceSupport {
    
    private final T bean;
    
    public IdentifiableResourceSupport(T bean) {
        this.bean = bean;
    }
    
    @JsonProperty(value = "id")
    public Long getResourceId() {
        return this.bean.getId();
    }
    
    @JsonIgnore
    public T getBean() {
        return this.bean;
    }
    
}
