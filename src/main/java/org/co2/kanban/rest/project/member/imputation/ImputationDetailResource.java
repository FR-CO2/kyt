/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.member.imputation;

import java.sql.Timestamp;
import org.springframework.hateoas.ResourceSupport;

/**
 *
 * @author ben
 */
public class ImputationDetailResource extends ResourceSupport {
    
    private final String taskName;
    
    private final Long taskId;
    
    private final Float timeSpent;

    public ImputationDetailResource(String taskName, Long taskId, Float timeSpent) {
        this.taskName = taskName;
        this.taskId = taskId;
        this.timeSpent = timeSpent;
    }

    public String getTaskName() {
        return taskName;
    }

    public Long getTaskId() {
        return taskId;
    }

    public Float getTimeSpent() {
        return timeSpent;
    }

}
