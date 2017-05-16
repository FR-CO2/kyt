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
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.TableGenerator;
import org.co2.kanban.repository.Identifiable;

/**
 *
 * @author ben
 */
@Entity
@Table(name = "KYT_MEMBER")
public class ProjectMember implements Serializable, Identifiable {

    private static final long serialVersionUID = 4462667625489059354L;
    
    @TableGenerator(
            name = "member_generator", table = "kyt_internal_sequence", pkColumnName = "sequence_name",
            valueColumnName = "sequence_next_hi_value", pkColumnValue = "member_generator")
    @Id
    @GeneratedValue(generator = "member_generator", strategy = GenerationType.TABLE)
    private Long id;

    @ManyToOne(cascade = CascadeType.DETACH)
    private Project project;

    @ManyToOne(cascade = CascadeType.DETACH)
    private ApplicationUser user;

    @ManyToMany(mappedBy = "assignees")
    private List<Task> tasksAssignee;

    private ProjectRole projectRole;

    @Override
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

    public boolean hasRole(ProjectRole role) {
        return this.getProjectRole().equals(role);
    }

    @Override
    public int hashCode() {
        return this.getId().hashCode();
    }

    @Override
    public boolean equals(Object obj) {
        return obj.getClass().isAssignableFrom(ProjectMember.class) && this.hashCode() == obj.hashCode();
    }

}
