/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.repository.member;

import org.co2.kanban.repository.project.Project;
import org.co2.kanban.repository.swimlane.Swimlane;
import org.co2.kanban.repository.task.Task;
import org.co2.kanban.repository.allocation.Allocation;
import org.co2.kanban.repository.user.ApplicationUser;
import java.io.Serializable;
import java.util.List;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

/**
 *
 * @author ben
 */
@Entity
public class Member implements Serializable {

    private static final long serialVersionUID = 4462667625489059354L;

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne(cascade = CascadeType.DETACH)
    private Project project;

    @ManyToOne(cascade = CascadeType.DETACH)
    private ApplicationUser user;

    @OneToMany
    private List<Allocation> allocations;

    @OneToMany(mappedBy = "responsable", cascade = CascadeType.DETACH)
    private List<Swimlane> swimlanes;

    @OneToMany(cascade = CascadeType.ALL)
    private List<Task> tasks;

    private ProjectRole projectRole;

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

    public ProjectRole getProjectRole() {
        return projectRole;
    }

    public void setProjectRole(ProjectRole projectRole) {
        this.projectRole = projectRole;
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

    public List<Allocation> getAllocations() {
        return allocations;
    }

    public void setAllocations(List<Allocation> allocations) {
        this.allocations = allocations;
    }

    public boolean hasRole(ProjectRole role) {
        return this.getProjectRole().equals(role);
    }
}