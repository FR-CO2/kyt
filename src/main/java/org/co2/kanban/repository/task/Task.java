/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.repository.task;

import org.co2.kanban.repository.project.Project;
import org.co2.kanban.repository.state.State;
import org.co2.kanban.repository.category.Category;
import org.co2.kanban.repository.member.Member;
import org.co2.kanban.repository.swimlane.Swimlane;
import org.co2.kanban.repository.allocation.Allocation;
import java.io.Serializable;
import java.sql.Timestamp;
import java.util.List;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import org.co2.kanban.repository.Identifiable;
import org.co2.kanban.repository.comment.Comment;

/**
 *
 * @author ben
 */
@Entity
public class Task implements Serializable, Identifiable {

    private static final long serialVersionUID = -7133694782401886935L;

    @Id
    @GeneratedValue
    private Long id;

    private String name;

    private Timestamp created;

    private Timestamp lastModified;

    @ManyToOne(cascade = CascadeType.DETACH)
    private Category category;

    @ManyToOne
    private State state;

    @ManyToOne(cascade = CascadeType.DETACH)
    private Swimlane swimlane;

    @ManyToOne
    private Project project;

    @ManyToOne(cascade = CascadeType.DETACH)
    private Member assignee;

    private Timestamp plannedStart;

    private Timestamp plannedEnding;

    private Float estimatedLoad;

    @Column(columnDefinition = "LONGTEXT")
    private String description;

    @OneToMany(mappedBy = "task")
    private List<Allocation> allocations;

    @OneToMany(mappedBy = "task")
    private List<Comment> comments;

    @ManyToOne
    private Task linkedTask;

    @OneToMany(mappedBy = "linkedTask")
    private List<Task> childrenTask;

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

    public Float getEstimatedLoad() {
        return estimatedLoad;
    }

    public void setEstimatedLoad(Float estimatedLoad) {
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

    public Member getAssignee() {
        return assignee;
    }

    public void setAssignee(Member assignee) {
        this.assignee = assignee;
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

    public Task getLinkedTask() {
        return linkedTask;
    }

    public void setLinkedTask(Task linkedTask) {
        this.linkedTask = linkedTask;
    }

    public List<Task> getChildrenTask() {
        return childrenTask;
    }

    public void setChildrenTask(List<Task> childrenTask) {
        this.childrenTask = childrenTask;
    }

}
