/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.repository.user;

import org.co2.kanban.repository.member.Member;
import com.fasterxml.jackson.annotation.JsonIgnore;
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
public class ApplicationUser implements Serializable {

    private static final long serialVersionUID = 1590255859243784563L;
    
    @Id
    @GeneratedValue
    private Long id;

    private String username;

    private String email;

    private String password;

    private ApplicationUserRole applicationRole;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
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