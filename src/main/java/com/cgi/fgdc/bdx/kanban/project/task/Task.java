/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.cgi.fgdc.bdx.kanban.project.task;

import com.cgi.fgdc.bdx.kanban.ControllerViews;
import com.cgi.fgdc.bdx.kanban.project.Project;
import com.cgi.fgdc.bdx.kanban.project.state.State;
import com.cgi.fgdc.bdx.kanban.project.category.Category;
import com.cgi.fgdc.bdx.kanban.project.security.Member;
import com.cgi.fgdc.bdx.kanban.project.swimlane.Swimlane;
import com.cgi.fgdc.bdx.kanban.project.task.allocation.Allocation;
import com.cgi.fgdc.bdx.kanban.project.task.allocation.AllocationDateComparator;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonView;
import java.io.Serializable;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.PostLoad;
import javax.persistence.Transient;

/**
 *
 * @author ben
 */
@Entity
public class Task implements Serializable {

    private static final long serialVersionUID = -7133694782401886935L;

    @Id
    @GeneratedValue
    @JsonView(ControllerViews.TaskList.class)
    private Long id;

    @JsonView(ControllerViews.TaskList.class)
    private String name;

    @JsonView(ControllerViews.TaskList.class)
    private Timestamp created;

    @JsonView(ControllerViews.TaskList.class)
    private Timestamp lastModified;

    @ManyToOne(cascade = CascadeType.DETACH)
    @JsonView(ControllerViews.TaskList.class)
    private Category category;

    @ManyToOne(cascade = CascadeType.DETACH)
    @JsonView(ControllerViews.TaskList.class)
    private State state;

    @ManyToOne
    @JsonView(ControllerViews.TaskList.class)
    private Swimlane swimlane;

    @ManyToOne(cascade = CascadeType.DETACH)
    @JsonView(ControllerViews.UserTask.class)
    private Project project;

    @ManyToOne(cascade = CascadeType.DETACH)
    @JsonView(ControllerViews.TaskList.class)
    private Member assignee;

    @ManyToOne(cascade = CascadeType.DETACH)
    @JsonView(ControllerViews.TaskList.class)
    private Member backup;

    @JsonView(ControllerViews.TaskList.class)
    private Timestamp plannedStart;

    @JsonView(ControllerViews.TaskList.class)
    private Timestamp plannedEnding;

    @JsonView(ControllerViews.TaskList.class)
    private Long estimatedLoad;

    @JsonView(ControllerViews.TaskList.class)
    private String description;
    
    @JsonView(ControllerViews.TaskList.class)
    @Transient
    private Long timeSpent = 0L;
    
    @JsonView(ControllerViews.TaskList.class)
    @Transient
    private Long timeRemains = 0L;
    
    @JsonIgnore
    @OneToMany(mappedBy = "task")
    private List<Allocation> allocations;
    
    @PostLoad
    public void onLoad(){
        if(!allocations.isEmpty()){
            for(Allocation alloc : this.allocations) {
                this.timeSpent += alloc.getTimeSpent();
            }

            Collections.sort(allocations, new AllocationDateComparator());
            this.timeRemains = allocations.get(allocations.size()-1).getTimeRemains();
        }
    }

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

    public State getState() {
        return state;
    }

    public void setState(State state) {
        this.state = state;
    }

    public Member getBackup() {
        return backup;
    }

    public void setBackup(Member backup) {
        this.backup = backup;
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

    public Long getEstimatedLoad() {
        return estimatedLoad;
    }

    public void setEstimatedLoad(Long estimatedLoad) {
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

    public Long getCategoryId() {
        if (this.category != null) {
            return category.getId();
        }
        return null;
    }

    public Long getAssigneeId() {
        if (this.assignee != null) {
            return assignee.getUser().getId();
        }
        return null;
    }

    public Long getBackupId() {
        if (this.backup != null) {
            return backup.getUser().getId();
        }
        return null;
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

    public Long getStateId() {
        if (this.state != null) {
            return state.getId();
        }
        return null;
    }

    public Long getSwimlaneId() {
        if (this.swimlane != null) {
            return swimlane.getId();
        }
        return null;
    }

    public List<Allocation> getAllocations() {
        return allocations;
    }

    public void setAllocations(List<Allocation> allocations) {
        this.allocations = allocations;
    }
    
    public Long getTimeSpent() {
        return timeSpent;
    }

    public void setTimeSpent(Long timeSpent) {
        this.timeSpent = timeSpent;
    }

    public Long getTimeRemains() {
        return timeRemains;
    }

    public void setTimeRemains(Long timeRemains) {
        this.timeRemains = timeRemains;
    }   
}
