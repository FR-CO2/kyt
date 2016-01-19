/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.task;

import java.sql.Timestamp;
import org.co2.kanban.repository.allocation.Allocation;
import org.co2.kanban.repository.member.Member;
import org.co2.kanban.rest.project.ProjectController;
import org.co2.kanban.rest.project.category.CategoryController;
import org.co2.kanban.rest.project.member.MemberController;
import org.co2.kanban.rest.project.state.StateController;
import org.co2.kanban.rest.project.swimlane.SwimlaneController;
import org.co2.kanban.repository.task.Task;
import org.co2.kanban.rest.project.task.allocation.AllocationController;
import org.co2.kanban.rest.project.task.comment.CommentController;
import org.co2.kanban.rest.project.task.field.TaskFieldController;
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

    private Float calculateTimeRemains(Float currentTimeRemains, Allocation allocation) {
        Float timeRemains = currentTimeRemains;
        if (allocation.getTimeRemains() != null) {
            timeRemains = allocation.getTimeRemains();
        } else {
            timeRemains = timeRemains - allocation.getTimeSpent();
        }
        return timeRemains;
    }

    @Override
    public TaskResource toResource(Task task) {
        TaskResource resource = new TaskResource(task);
        //TODO report calcul time remains 
        Float timeSpent = 0F;
        Float timeRemains = task.getEstimatedLoad();
        Timestamp timeRemainsAllocationDate = null;
        if (task.getAllocations() != null) {
            for (Allocation allocation : task.getAllocations()) {
                if (timeRemainsAllocationDate == null) {
                    timeRemainsAllocationDate = allocation.getAllocationDate();
                    timeRemains = calculateTimeRemains(timeRemains, allocation);
                }
                if (timeRemainsAllocationDate.before(allocation.getAllocationDate())) {
                    timeRemains = calculateTimeRemains(timeRemains, allocation);
                }
                timeSpent += allocation.getTimeSpent();
            }
        }
        resource.setTimeRemains(timeRemains);
        resource.setTimeSpent(timeSpent);
        resource.add(linkTo(methodOn(ProjectController.class).get(task.getProject().getId())).withRel("project"));
        resource.add(linkTo(methodOn(StateController.class).get(task.getProject().getId(), task.getState().getId())).withRel("state"));
        resource.add(linkTo(methodOn(TaskController.class).get(task.getProject().getId(), task.getId())).withSelfRel());
        if (task.getAssignees() != null) {
            for (Member assignee : task.getAssignees()) {
                resource.add(linkTo(methodOn(MemberController.class).get(task.getProject().getId(), assignee.getId())).withRel("assignee"));
            }
        }
        if (task.getSwimlane() != null) {
            resource.add(linkTo(methodOn(SwimlaneController.class).get(task.getProject().getId(), task.getSwimlane().getId())).withRel("swimlane"));
        }
        if (task.getCategory() != null) {
            resource.add(linkTo(methodOn(CategoryController.class).get(task.getProject().getId(), task.getCategory().getId())).withRel("category"));
        }
        resource.add(linkTo(methodOn(CommentController.class).comments(task.getProject().getId(), task.getId())).withRel("comment"));
        resource.add(linkTo(methodOn(AllocationController.class).list(task.getProject().getId(), task.getId())).withRel("allocation"));
        resource.add(linkTo(methodOn(TaskFieldController.class).list(task.getProject().getId(), task.getId())).withRel("customfield"));
        return resource;
    }
}
