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

    private final Task task;
    
    private Float timeSpent = 0F;
    
    private Float timeRemains = null;

    public UserTaskImputationResource(Task task) {
        this.task = task;
    }

    public String getTaskName() {
        return this.task.getName();
    }

    public Long getTaskId() {
        return this.task.getId();
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
