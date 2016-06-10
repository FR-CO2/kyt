/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.taskfield;

import org.co2.kanban.repository.taskfield.TaskFieldDefinition;
import org.co2.kanban.repository.taskfield.TaskFieldType;
import org.co2.kanban.rest.IdentifiableResourceSupport;

/**
 *
 * @author ben
 */
public class TaskFieldDefResource extends IdentifiableResourceSupport<TaskFieldDefinition> {

    public TaskFieldDefResource(TaskFieldDefinition bean) {
        super(bean);
    }

    public String getFieldName() {
        return this.getBean().getName();
    }

    public TaskFieldType getType() {
        return this.getBean().getType();
    }

    public Boolean isRequired() {
        return this.getBean().getRequired();
    }
}
