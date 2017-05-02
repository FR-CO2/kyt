/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.repository.task;

import org.co2.kanban.repository.project.Project;
import org.co2.kanban.repository.state.State;
import org.co2.kanban.repository.category.Category;
import org.co2.kanban.repository.member.ProjectMember;
import org.co2.kanban.repository.swimlane.Swimlane;
import org.co2.kanban.repository.allocation.Allocation;
import java.io.Serializable;
import java.sql.Timestamp;
import java.util.List;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.TableGenerator;
import org.co2.kanban.repository.Identifiable;
import org.co2.kanban.repository.comment.Comment;
import org.co2.kanban.repository.taskfield.TaskField;

/**
 *
 * @author ben
 */
@Entity
@Table(name = "KYT_TASK")
public class Task implements Serializable, Identifiable {

    private static final long serialVersionUID = -7133694782401886935L;

    @TableGenerator(
            name = "task_generator", table = "kyt_internal_sequence", pkColumnName = "sequence_name",
            valueColumnName = "sequence_next_hi_value", pkColumnValue = "task_generator")
    @Id
    @GeneratedValue(generator = "task_generator", strategy = GenerationType.TABLE)
    private Long id;

    private String name;

    private Timestamp created;

    private Timestamp lastModified;

    private Timestamp plannedStart;

    private Timestamp plannedEnding;

    private Double estimatedLoad;

    @Column(length = 10000)
    private String description;

    @ManyToOne(cascade = CascadeType.DETACH)
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne
    @JoinColumn(name = "state_id")
    private State state;

    @ManyToOne(cascade = CascadeType.DETACH)
    @JoinColumn(name = "swimlane_id")
    private Swimlane swimlane;

    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;

    @OneToMany(mappedBy = "task")
    private List<Allocation> allocations;

    @OneToMany(mappedBy = "task")
    private List<Comment> comments;

    @OneToMany(mappedBy = "task")
    private List<TaskField> customField;

    @ManyToMany(mappedBy = "children")
    private List<Task> parent;

    @ManyToMany
    @JoinTable(name = "kyt_task_link",
            joinColumns
            = @JoinColumn(name = "task_parent_id", referencedColumnName = "ID"),
            inverseJoinColumns
            = @JoinColumn(name = "task_child_id", referencedColumnName = "ID"))
    private List<Task> children;

    @ManyToMany(cascade = CascadeType.DETACH)
    @JoinTable(name = "kyt_task_assignee",
            joinColumns
            = @JoinColumn(name = "task_id", referencedColumnName = "ID"),
            inverseJoinColumns
            = @JoinColumn(name = "member_id", referencedColumnName = "ID")
    )
    private List<ProjectMember> assignees;
    
    private Boolean urgent;
    
    private Boolean deleted;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getName() {
        return this.name;
    }

    public State getState() {
        return state;
    }

    public void setState(State state) {
        this.state = state;
    }

    public Timestamp getPlannedStart() {
        return plannedStart;
    }

    public void setPlannedStart(Timestamp plannedStart) {
        this.plannedStart = plannedStart;
    }

    public Timestamp getPlannedEnding() {
        return plannedEnding;
    }

    public void setPlannedEnding(Timestamp plannedEnding) {
        this.plannedEnding = plannedEnding;
    }

    public Double getEstimatedLoad() {
        return estimatedLoad;
    }

    public void setEstimatedLoad(Double estimatedLoad) {
        this.estimatedLoad = estimatedLoad;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Timestamp getCreated() {
        return created;
    }

    public void setCreated(Timestamp created) {
        this.created = created;
    }

    public Timestamp getLastModified() {
        return lastModified;
    }

    public void setLastModified(Timestamp lastModified) {
        this.lastModified = lastModified;
    }

    public List<ProjectMember> getAssignees() {
        return assignees;
    }

    public void setAssignees(List<ProjectMember> assignees) {
        this.assignees = assignees;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public Swimlane getSwimlane() {
        return swimlane;
    }

    public void setSwimlane(Swimlane swimlane) {
        this.swimlane = swimlane;
    }

    public List<Allocation> getAllocations() {
        return allocations;
    }

    public void setAllocations(List<Allocation> allocations) {
        this.allocations = allocations;
    }

    public List<Comment> getComments() {
        return comments;
    }

    public void setComments(List<Comment> comments) {
        this.comments = comments;
    }

    public List<Task> getParent() {
        return parent;
    }

    public void setParent(List<Task> parent) {
        this.parent = parent;
    }

    public List<Task> getChildren() {
        return children;
    }

    public void setChildren(List<Task> children) {
        this.children = children;
    }

    public List<TaskField> getCustomField() {
        return customField;
    }

    public void setCustomField(List<TaskField> customField) {
        this.customField = customField;
    }

    public Boolean isUrgent() {
        return urgent;
    }

    public void setUrgent(Boolean urgent) {
        this.urgent = urgent;
    }
    
    public Boolean isDeleted() {
        return deleted;
    }

    public void setDeleted(Boolean deleted) {
        this.deleted = deleted;
    }
    
}
