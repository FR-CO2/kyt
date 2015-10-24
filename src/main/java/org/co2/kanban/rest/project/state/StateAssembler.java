/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.state;

import org.co2.kanban.repository.state.State;
import org.springframework.hateoas.mvc.ResourceAssemblerSupport;
import org.co2.kanban.rest.project.ProjectController;
import org.co2.kanban.rest.project.task.TaskListController;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

/**
 *
 * @author ben
 */
public class StateAssembler extends ResourceAssemblerSupport<State, StateResource> {

    public StateAssembler() {
        super(StateController.class, StateResource.class);
    }

    @Override
    public StateResource toResource(State state) {
        StateResource resource = createResourceWithId(state.getId(), state);
        resource.setName(state.getName());
        resource.setPosition(state.getPosition());
        resource.setTaskCount(state.getTasks().size());
        resource.setCloseState(state.getCloseState());
        resource.setKanbanHide(state.getKanbanHide());
        resource.add(linkTo(methodOn(ProjectController.class).get(state.getProject().getId())).withRel("project"));
        resource.add(linkTo(methodOn(TaskListController.class).filterBySwimlane(state.getProject().getId(), state.getId())).withRel("tasks"));
        return resource;
    }

}
