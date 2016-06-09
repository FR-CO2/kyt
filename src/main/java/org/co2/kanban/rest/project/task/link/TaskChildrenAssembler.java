/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.task.link;

import org.co2.kanban.repository.task.Task;
import org.co2.kanban.rest.project.task.TaskController;
import org.springframework.hateoas.ResourceSupport;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;
import org.springframework.hateoas.mvc.ResourceAssemblerSupport;
import org.springframework.stereotype.Component;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;

/**
 *
 * @author courtib
 */
@Component
public class TaskChildrenAssembler extends ResourceAssemblerSupport<Task, ResourceSupport> {

    public TaskChildrenAssembler() {
        super(TaskLinkController.class, ResourceSupport.class);
    }

    @Override
    public ResourceSupport toResource(Task t) {
        ResourceSupport resource = createResourceWithId(t.getId(), t);
        resource.add(linkTo(methodOn(TaskLinkController.class).children(t.getProject().getId(), t.getId())).withSelfRel());
        resource.add(linkTo(methodOn(TaskController.class).get(t.getProject().getId(), t.getId())).withRel("task"));
        for (Task child : t.getChildren()) {
            resource.add(linkTo(methodOn(TaskController.class).get(t.getProject().getId(), child.getId())).withRel("child"));
        }
        return resource;
    }

}
