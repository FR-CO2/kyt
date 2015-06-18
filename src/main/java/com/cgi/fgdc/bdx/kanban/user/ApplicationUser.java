/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.cgi.fgdc.bdx.kanban.user;

import com.cgi.fgdc.bdx.kanban.ControllerViews;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonView;
import java.io.Serializable;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

/**
 *
 * @author ben
 */
@Entity
public class ApplicationUser implements Serializable {

    private static final long serialVersionUID = 1590255859243784563L;

    @Id
    @GeneratedValue
    @JsonView(ControllerViews.Task.class)
    private Long id;

    @JsonView(ControllerViews.TaskList.class)
    private String username;

    private String email;

    @JsonIgnore
    private String password;

    private ApplicationUserRole applicationRole;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

}
