/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.task;

import org.co2.kanban.repository.allocation.Allocation;
import org.co2.kanban.rest.project.ProjectController;
import org.co2.kanban.rest.project.category.CategoryController;
import org.co2.kanban.rest.project.member.MemberController;
import org.co2.kanban.rest.project.state.StateController;
import org.co2.kanban.rest.project.swimlane.SwimlaneController;
import org.co2.kanban.repository.task.Task;
import org.co2.kanban.rest.project.task.allocation.AllocationController;
import org.co2.kanban.rest.project.task.comment.CommentController;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;
import org.springframework.hateoas.mvc.ResourceAssemblerSupport;
import org.springframework.stereotype.Component;

/**
 *
 * @author ben
 */
@Component
public class TaskAssembler extends ResourceAssemblerSupport<Task, TaskResource> {

    public TaskAssembler() {
        super(TaskController.class, TaskResource.class);
    }

    @Override
    public TaskResource toResource(Task task) {
        TaskResource resource = new TaskResource(task);
        //TODO report calcul time remains 
        Float timespent = 0F;
        for (Allocation allocation : task.getAllocations()) {
            timespent += allocation.getTimeSpent();
        }
        resource.setTimeRemains(0F);
        resource.setTimeSpent(timespent);
        resource.add(linkTo(methodOn(ProjectController.class).get(task.getProject().getId())).withRel("project"));
        resource.add(linkTo(methodOn(StateController.class, task.getProject().getId()).get(task.getState().getId())).withRel("state"));
        resource.add(linkTo(methodOn(TaskController.class, task.getProject().getId(), task.getId()).get(task.getId())).withSelfRel());
        if (task.getAssignee() != null) {
            resource.add(linkTo(methodOn(MemberController.class, task.getProject().getId()).get(task.getAssignee().getId())).withRel("assignee"));
        }
        if (task.getBackup() != null) {
            resource.add(linkTo(methodOn(MemberController.class, task.getProject().getId()).get(task.getBackup().getId())).withRel("backup"));
        }
        if (task.getSwimlane() != null) {
            resource.add(linkTo(methodOn(SwimlaneController.class, task.getProject().getId()).get(task.getSwimlane().getId())).withRel("swimlane"));
        }
        if (task.getCategory() != null) {
            resource.add(linkTo(methodOn(CategoryController.class, task.getProject().getId()).get(task.getCategory().getId())).withRel("category"));
        }
        resource.add(linkTo(methodOn(CommentController.class, task.getProject().getId(), task.getId()).comments(task.getId())).withRel("comment"));
        
        return resource;
    }
}
