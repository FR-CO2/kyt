/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.cgi.fgdc.bdx.kanban.project.group;

import com.cgi.fgdc.bdx.kanban.project.Project;
import com.cgi.fgdc.bdx.kanban.project.security.Member;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.io.Serializable;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;

/**
 *
 * @author ben
 */
@Entity
public class ProjectGroup implements Serializable {

    private static final long serialVersionUID = 9067365517863789740L;

    @Id
    private Long id;

    private String name;

    @ManyToOne
    @JsonIgnore
    private Project project;

    @JsonIgnore
    @ManyToMany
    @JoinTable(
            name = "MEMBER_GROUP",
            joinColumns = {
                @JoinColumn(name = "GROUP_ID", referencedColumnName = "ID")},
            inverseJoinColumns = {
                @JoinColumn(name = "MEMBER_ID", referencedColumnName = "ID")})
    private List<Member> members;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Member> getMembers() {
        return members;
    }

    public void setMembers(List<Member> members) {
        this.members = members;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

}