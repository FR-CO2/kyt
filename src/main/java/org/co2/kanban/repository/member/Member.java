/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.repository.member;

import org.co2.kanban.repository.project.Project;
import org.co2.kanban.repository.task.Task;
import org.co2.kanban.repository.allocation.Allocation;
import org.co2.kanban.repository.user.ApplicationUser;
import java.io.Serializable;
import java.util.List;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import org.co2.kanban.repository.Identifiable;

/**
 *
 * @author ben
 */
@Entity
@Table(name = "KYT_MEMBER")
public class Member implements Serializable, Identifiable {

    private static final long serialVersionUID = 4462667625489059354L;

    @SequenceGenerator(name = "member_generator", sequenceName = "member_pkey_seq")
    @Id
    @GeneratedValue(generator = "member_generator")
    private Long id;

    @ManyToOne(cascade = CascadeType.DETACH)
    private Project project;

    @ManyToOne(cascade = CascadeType.DETACH)
    private ApplicationUser user;

    @OneToMany
    private List<Allocation> allocations;

    @ManyToMany(mappedBy = "assignees")
    private List<Task> tasksAssignee;

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

    public List<Task> getTasksAssignee() {
        return tasksAssignee;
    }

    public void setTasksAssignee(List<Task> tasksAssignee) {
        this.tasksAssignee = tasksAssignee;
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

    @Override
    public int hashCode() {
        return this.getId().hashCode();
    }

    @Override
    public boolean equals(Object obj) {
        return obj.getClass().isAssignableFrom(Member.class) && this.hashCode() == obj.hashCode();
    }

}
