/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.task.field;

import org.co2.kanban.repository.taskfield.TaskField;
import org.co2.kanban.rest.project.taskfield.TaskFieldDefController;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;
import org.springframework.hateoas.mvc.ResourceAssemblerSupport;
import org.springframework.stereotype.Component;

/**
 *
 * @author ben
 */
@Component
public class TaskFieldAssembler extends ResourceAssemblerSupport<TaskField, TaskFieldResource> {

    public TaskFieldAssembler() {
        super(TaskFieldController.class, TaskFieldResource.class);
    }

    @Override
    public TaskFieldResource toResource(TaskField entity) {
        TaskFieldResource resource = new TaskFieldResource(entity);
        resource.add(linkTo(methodOn(TaskFieldDefController.class).get(entity.getTask().getProject().getId(),  entity.getDefinition().getId())).withRel("definition"));
        resource.add(linkTo(methodOn(TaskFieldController.class).get(entity.getTask().getProject().getId(), entity.getTask().getId(), entity.getDefinition().getId())).withSelfRel());
        
        return resource;
    }

}
