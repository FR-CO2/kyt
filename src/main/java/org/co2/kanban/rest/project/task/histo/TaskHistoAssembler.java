/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.task.histo;

import org.co2.kanban.rest.project.task.field.*;
import org.co2.kanban.repository.taskhisto.TaskHisto;
import org.co2.kanban.rest.project.ProjectController;
import org.co2.kanban.rest.project.category.CategoryController;
import org.co2.kanban.rest.project.state.StateController;
import org.co2.kanban.rest.project.swimlane.SwimlaneController;
import org.co2.kanban.rest.project.task.allocation.AllocationController;
import org.co2.kanban.rest.project.task.assignee.AssigneeController;
import org.co2.kanban.rest.project.task.link.TaskLinkController;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;
import org.springframework.hateoas.mvc.ResourceAssemblerSupport;
import org.springframework.stereotype.Component;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;

/**
 *
 * @author ben
 */
@Component
public class TaskHistoAssembler extends ResourceAssemblerSupport<TaskHisto, TaskHistoResource> {

    public TaskHistoAssembler() {
        super(TaskHistoController.class, TaskHistoResource.class);
    }

    @Override
    public TaskHistoResource toResource(TaskHisto taskHisto) {
        TaskHistoResource resource = new TaskHistoResource(taskHisto);
        resource.add(linkTo(methodOn(ProjectController.class).get(taskHisto.getTask().getProject().getId())).withRel("project"));
        resource.add(linkTo(methodOn(StateController.class).get(taskHisto.getTask().getProject().getId(), taskHisto.getTask().getState().getId())).withRel("state"));
        resource.add(linkTo(methodOn(AssigneeController.class).list(taskHisto.getTask().getProject().getId(), taskHisto.getTask().getId())).withRel("assignee"));
        if (taskHisto.getTask().getSwimlane() != null) {
            resource.add(linkTo(methodOn(SwimlaneController.class).get(taskHisto.getTask().getProject().getId(), taskHisto.getTask().getSwimlane().getId())).withRel("swimlane"));
        }
        if (taskHisto.getTask().getCategory() != null) {
            resource.add(linkTo(methodOn(CategoryController.class).get(taskHisto.getTask().getProject().getId(), taskHisto.getTask().getCategory().getId())).withRel("category"));
        }
        resource.add(linkTo(methodOn(AllocationController.class).list(taskHisto.getTask().getProject().getId(), taskHisto.getTask().getId())).withRel("allocation"));
        resource.add(linkTo(methodOn(TaskFieldController.class).list(taskHisto.getTask().getProject().getId(), taskHisto.getTask().getId())).withRel("customfield"));
        resource.add(linkTo(methodOn(TaskLinkController.class).parents(taskHisto.getTask().getProject().getId(), taskHisto.getTask().getId())).withRel("parents"));
        resource.add(linkTo(methodOn(TaskLinkController.class).children(taskHisto.getTask().getProject().getId(), taskHisto.getTask().getId())).withRel("children"));
        return resource;
    }

}
