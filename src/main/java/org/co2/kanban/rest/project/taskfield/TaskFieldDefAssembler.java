/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.taskfield;

import org.co2.kanban.repository.taskfield.TaskFieldDefinition;
import org.springframework.hateoas.mvc.ResourceAssemblerSupport;
import org.springframework.stereotype.Component;

/**
 *
 * @author ben
 */
@Component
public class TaskFieldDefAssembler extends ResourceAssemblerSupport<TaskFieldDefinition, TaskFieldDefResource> {

    public TaskFieldDefAssembler() {
        super(TaskFieldDefController.class, TaskFieldDefResource.class);
    }

    @Override
    public TaskFieldDefResource toResource(TaskFieldDefinition entity) {
        TaskFieldDefResource resource = new TaskFieldDefResource(entity);
        return resource;
    }

}
