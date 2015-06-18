/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.cgi.fgdc.bdx.kanban.project.security;

import com.cgi.fgdc.bdx.kanban.ControllerViews;
import com.cgi.fgdc.bdx.kanban.project.Project;
import com.cgi.fgdc.bdx.kanban.project.group.Group;
import com.cgi.fgdc.bdx.kanban.project.swimlane.Swimlane;
import com.cgi.fgdc.bdx.kanban.project.task.Task;
import com.cgi.fgdc.bdx.kanban.user.ApplicationUser;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonView;
import java.io.Serializable;
import java.util.List;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Transient;

/**
 *
 * @author ben
 */
@Entity
public class Member implements Serializable {

    private static final long serialVersionUID = 4462667625489059354L;

    @Id
    @GeneratedValue
    @JsonView(ControllerViews.Task.class)
    private Long id;

    @ManyToOne(cascade = CascadeType.DETACH)
    @JsonIgnore
    private Project project;

    @ManyToOne(cascade = CascadeType.DETACH)
    @JsonView(ControllerViews.TaskList.class)
    private ApplicationUser user;

    @ManyToMany(mappedBy = "members", cascade = CascadeType.DETACH)
    @JsonIgnore
    private List<Group> groups;

    @OneToMany(mappedBy = "responsable", cascade = CascadeType.DETACH)
    private List<Swimlane> swimlanes;

    @OneToMany(cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Task> tasks;

    private ProjectRole projectRole;

    @Transient
    private Long applicationUserId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public ApplicationUser getUser() {
        return user;
    }

    public void setUser(ApplicationUser user) {
        this.user = user;
    }

    public Long getApplicationUserId() {
        return applicationUserId;
    }

    public void setApplicationUserId(Long applicationUserId) {
        this.applicationUserId = applicationUserId;
    }

    public ProjectRole getProjectRole() {
        return projectRole;
    }

    public void setProjectRole(ProjectRole projectRole) {
        this.projectRole = projectRole;
    }

    public List<Group> getGroups() {
        return groups;
    }

    public void setGroups(List<Group> groups) {
        this.groups = groups;
    }

    public List<Swimlane> getSwimlanes() {
        return swimlanes;
    }

    public void setSwimlanes(List<Swimlane> swimlanes) {
        this.swimlanes = swimlanes;
    }

    public List<Task> getTasks() {
        return tasks;
    }

    public void setTasks(List<Task> tasks) {
        this.tasks = tasks;
    }

}
