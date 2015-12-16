/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest;

import org.springframework.hateoas.Link;

/**
 *
 * @author ben
 */
public class NamedLink extends Link{
    private static final long serialVersionUID = -7270909637883381455L;
    
    public NamedLink(Link link) {
        super(link.getHref(), link.getRel());
    }
    
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
    
    
}
