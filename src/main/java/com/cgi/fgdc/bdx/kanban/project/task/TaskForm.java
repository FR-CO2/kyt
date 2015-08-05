/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.cgi.fgdc.bdx.kanban.project.task;

import com.cgi.fgdc.bdx.kanban.ControllerViews;
import com.cgi.fgdc.bdx.kanban.project.Project;
import com.cgi.fgdc.bdx.kanban.project.security.Member;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonView;

/**
 *
 * @author ben
 */
public class TaskForm extends Task {

    @JsonIgnore
    private Project project;

    @JsonIgnore
    private Member assignee;

    @JsonIgnore
    private Member backup;

    @JsonView(ControllerViews.Task.class)
    private Long stateId;

    @JsonView(ControllerViews.Task.class)
    private Long swimlaneId;

    @JsonView(ControllerViews.Task.class)
    private Long categoryId;

    @JsonView(ControllerViews.Task.class)
    private Long backupId;

    @JsonView(ControllerViews.Task.class)
    private Long assigneeId;
    
    @JsonView(ControllerViews.Task.class)
    private Long timeRemains = 0L;
    
    @JsonView(ControllerViews.Task.class)
    private Long timeSpent = 0L;

    public void setStateId(Long stateId) {
        this.stateId = stateId;
    }

    public void setSwimlaneId(Long swimlaneId) {
        this.swimlaneId = swimlaneId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public void setAssigneeId(Long assigneeId) {
        this.assigneeId = assigneeId;
    }

    public void setBackupId(Long backupId) {
        this.backupId = backupId;
    }

    public void setTimeremains(Long timeremains) {
        this.timeRemains = timeremains;
    }

    public void setTimespent(Long timespend) {
        this.timeSpent = timespend;
    }

    @Override
    public Long getCategoryId() {
        return this.categoryId;
    }

    @Override
    public Long getAssigneeId() {
        return this.assigneeId;
    }

    @Override
    public Long getBackupId() {
        return this.backupId;
    }

    @Override
    public Long getStateId() {
        return stateId;
    }

    @Override
    public Long getSwimlaneId() {
        return swimlaneId;
    }

    public Long getTimeremains() {
        return timeRemains;
    }
    
    public Long getTimespent() {
        return timeSpent;
    }
    
    
}
