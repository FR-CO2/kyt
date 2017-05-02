/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.user.consommation;

import org.co2.kanban.repository.task.Task;
import org.springframework.hateoas.ResourceSupport;

/**
 *
 * @author ben
 */
public class UserTaskImputationResource extends ResourceSupport {

    private String taskName;
    
    private Long taskId;

    private Double timeSpent = 0D;

    private Double timeRemains = null;
    
    public UserTaskImputationResource() {
    }

    public UserTaskImputationResource(Task task) {
        this.taskName = task.getName();
        this.taskId = task.getId();
    }

    public String getTaskName() {
        return this.taskName;
    }

    public Long getTaskId() {
        return this.taskId;
    }

    public void setTaskName(String taskName) {
        this.taskName = taskName;
    }

    public void setTaskId(Long taskId) {
        this.taskId = taskId;
    }

    public Double getTimeSpent() {
        return timeSpent;
    }

    public void setTimeSpent(Double timeSpent) {
        this.timeSpent = timeSpent;
    }

    public Double getTimeRemains() {
        return timeRemains;
    }

    public void setTimeRemains(Double timeRemains) {
        this.timeRemains = timeRemains;
    }

}
