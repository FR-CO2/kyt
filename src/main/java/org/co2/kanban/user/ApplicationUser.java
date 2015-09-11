/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.user;

import org.co2.kanban.ControllerViews;
import org.co2.kanban.project.security.Member;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonView;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;

/**
 *
 * @author ben
 */
@Entity
@JsonIdentityInfo(generator=ObjectIdGenerators.UUIDGenerator.class, property = "@uuid")
public class ApplicationUser implements Serializable {

    private static final long serialVersionUID = 1590255859243784563L;

    @Id
    @GeneratedValue
    @JsonView(ControllerViews.User.class)
    private Long id;

    @JsonView(ControllerViews.User.class)
    private String username;

    @JsonView(ControllerViews.UserList.class)
    private String email;

    @JsonView(ControllerViews.CreateUser.class)
    private String password;

    @JsonView(ControllerViews.UserList.class)
    private ApplicationUserRole applicationRole;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonView(ControllerViews.User.class)
    private List<Member> members = new ArrayList<>();

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

    public boolean hasRole(ApplicationUserRole role) {
        return this.getApplicationRole().equals(role);
    }

    public List<Member> getMembers() {
        return members;
    }

    public void setMembers(List<Member> members) {
        this.members = members;
    }

}
