/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.task;

import org.co2.kanban.repository.state.State;
import org.co2.kanban.repository.task.Task;
import org.co2.kanban.repository.task.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;
import org.springframework.hateoas.mvc.ResourceAssemblerSupport;
import org.springframework.stereotype.Component;

/**
 *
 * @author granels
 */
@Component
public class TasksByStateAssembler extends ResourceAssemblerSupport<State, TasksByStateResource> {

    @Autowired
    private TaskRepository repository;

    public TasksByStateAssembler() {
        super(TaskListController.class, TasksByStateResource.class);
    }

    @Override
    public TasksByStateResource toResource(State t) {
        TasksByStateResource resource = new TasksByStateResource();
        resource.setStateId(t.getId());
        Iterable<Task> tasks = repository.findByProjectAndState(t.getProject(), t);
        for (Task task : tasks) {
            resource.add(linkTo(methodOn(TaskController.class, task.getProject().getId()).get(task.getId())).withRel("tasks"));
        }
        return resource;
    }

}
