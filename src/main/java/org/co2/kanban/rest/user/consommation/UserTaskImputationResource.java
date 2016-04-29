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

    private Float timeSpent = 0F;

    private Float timeRemains = null;
    
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

    public Float getTimeSpent() {
        return timeSpent;
    }

    public void setTimeSpent(Float timeSpent) {
        this.timeSpent = timeSpent;
    }

    public Float getTimeRemains() {
        return timeRemains;
    }

    public void setTimeRemains(Float timeRemains) {
        this.timeRemains = timeRemains;
    }

}
