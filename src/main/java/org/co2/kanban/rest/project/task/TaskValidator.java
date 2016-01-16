/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.task;

import org.co2.kanban.repository.task.Task;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

/**
 *
 * @author ben
 */
@Component
public class TaskValidator implements Validator {

    @Override
    public boolean supports(Class<?> type) {
        return Task.class.equals(type);
    }

    @Override
    public void validate(Object o, Errors errors) {
        Task task = (Task) o;
        if (task.getPlannedStart() != null && task.getPlannedEnding() != null
                && task.getPlannedStart().after(task.getPlannedEnding())) {
            errors.reject("project.task.error.startafterend");
        }
    }

}
