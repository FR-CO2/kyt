/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.task;

import java.sql.Timestamp;
import org.co2.kanban.repository.task.Task;
import org.co2.kanban.rest.IdentifiableResourceSupport;

/**
 *
 * @author ben
 */
public class TaskResource extends IdentifiableResourceSupport<Task> {


    private Float timeRemains;

    private Float timeSpent;

    public TaskResource(Task task) {
        super(task);
    }
    
    public String getName() {
        return getBean().getName();
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

    public Timestamp getCreated() {
        return getBean().getCreated();
    }

    public Timestamp getLastModified() {
        return getBean().getLastModified();
    }

    public Timestamp getPlannedStart() {
        return getBean().getPlannedStart();
    }

    public Timestamp getPlannedEnding() {
        return getBean().getPlannedEnding();
    }

    public Float getEstimatedLoad() {
        return getBean().getEstimatedLoad();
    }

    public String getDescription() {
        return getBean().getDescription();
    }

    public Boolean isUrgent(){
        return getBean().isUrgent();
    }
}
