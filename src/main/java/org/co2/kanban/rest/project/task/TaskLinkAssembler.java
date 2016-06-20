/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.task;

import org.co2.kanban.repository.task.Task;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;
import org.springframework.hateoas.mvc.ResourceAssemblerSupport;
import org.springframework.stereotype.Component;

/**
 *
 * @author courtib
 */
@Component
public class TaskLinkAssembler extends ResourceAssemblerSupport<Task, TaskLinkResource> {

    public TaskLinkAssembler() {
        super(TaskController.class, TaskLinkResource.class);
    }

    @Override
    public TaskLinkResource toResource(Task t) {
        TaskLinkResource resource = new TaskLinkResource(t);
        resource.add(linkTo(methodOn(TaskController.class).get(t.getProject().getId(), t.getId())).withSelfRel());
        return resource;
    }

}
