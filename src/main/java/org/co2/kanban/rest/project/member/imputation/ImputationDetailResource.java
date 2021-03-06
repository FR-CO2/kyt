/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.member.imputation;

import java.sql.Timestamp;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.hateoas.ResourceSupport;

/**
 *
 * @author ben
 */
public class ImputationDetailResource extends ResourceSupport {
    
    private final String taskName;
    
    private final Long taskId;
    
    private final Map<String, Double> imputations = new HashMap<>();

    public ImputationDetailResource(List<String> times, String taskName, Long taskId) {
        this.taskName = taskName;
        this.taskId = taskId;
        for (String time : times) {
            imputations.put(time, 0D);
        }
    }

    public String getTaskName() {
        return taskName;
    }

    public Long getTaskId() {
        return taskId;
    }
    
    public Map<String, Double> getImputations() {
        return this.imputations;
    }

}
