/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.user;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.co2.kanban.repository.user.ApplicationUserRole;
import org.springframework.hateoas.ResourceSupport;

/**
 *
 * @author ben
 */
public class UserResource extends ResourceSupport {
    
    @JsonProperty("id")
    private Long resourceId;
    
    private String username;
    
    private String email;
    
    private ApplicationUserRole applicationRole;

    public String getUsername() {
        return username;
    }

    public void setUsername(String name) {
        this.username = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public ApplicationUserRole getApplicationRole() {
        return applicationRole;
    }

    public void setApplicationRole(ApplicationUserRole applicationRole) {
        this.applicationRole = applicationRole;
    }

    public Long getResourceId() {
        return resourceId;
    }

    public void setResourceId(Long resourceId) {
        this.resourceId = resourceId;
    }
    
}
