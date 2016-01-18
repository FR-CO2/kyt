/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.task.field;

import org.co2.kanban.repository.taskfield.TaskField;
import org.springframework.hateoas.ResourceSupport;

/**
 *
 * @author ben
 */
public class TaskFieldResource extends ResourceSupport {

    private TaskField bean;

    public TaskFieldResource(TaskField taskField) {
        this.bean = taskField;
    }

    public String getFieldName() {
        return this.bean.getDefinition().getName();
    }

    public String getFieldValue() {
        return this.bean.getFieldValue();
    }

}
