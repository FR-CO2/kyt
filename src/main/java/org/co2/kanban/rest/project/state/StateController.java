/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.state;

import org.co2.kanban.repository.state.State;
import org.co2.kanban.repository.state.StateRepository;
import java.util.List;
import org.co2.kanban.repository.project.Project;
import org.co2.kanban.repository.project.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.Resource;
import org.springframework.hateoas.Resources;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author ben
 */
@RestController
@RequestMapping(value = "/api/project/{projectId}/state")
@PreAuthorize("@projectAccessExpression.hasMemberAccess(#projectId, principal.username)")
public class StateController {

    @Autowired
    private StateRepository repository;

    @Autowired
    private ProjectRepository projectRepository;

    @RequestMapping(method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public Resources<Resource<State>> projectList(@PathVariable("projectId") Long projectId) {
        Project project = projectRepository.findOne(projectId);
        return getStateResourceList(repository.findByProjectOrderByPositionAsc(project));
    }

    @RequestMapping(value = "kanban", method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public Resources<Resource<State>> kanbanList(@PathVariable("projectId") Long projectId) {
        Project project = projectRepository.findOne(projectId);
        return getStateResourceList(repository.findByProjectAndKanbanHideFalseOrderByPositionAsc(project));
    }

    @RequestMapping(value = "{id}", method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<State> get(@PathVariable("id") Long id) {
        State state = repository.findOne(id);
        return new ResponseEntity(state, HttpStatus.OK);
    }

    @RequestMapping(value = "{id}", method = RequestMethod.DELETE, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@projectAccessExpression.hasManagerAccess(#projectId, principal.username)")
    public ResponseEntity delete(@PathVariable("id") Long id) {
        repository.delete(id);
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }

    @RequestMapping(method = RequestMethod.POST, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@projectAccessExpression.hasManagerAccess(#projectId, principal.username)")
    public ResponseEntity<State> create(@PathVariable("projectId") Long projectId, @RequestBody State state) {
        Project project = projectRepository.findOne(projectId);
        state.setProject(project);
        Long maxPosition = repository.getProjectMaxPosition(projectId);
        if (maxPosition == null) {
            maxPosition = 0L;
        }
        state.setPosition(maxPosition);
        repository.save(state);
        return new ResponseEntity(state, HttpStatus.CREATED);
    }

    @RequestMapping(value = "{stateId}/position/{newPosition}", method = RequestMethod.POST, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@projectAccessExpression.hasManagerAccess(#projectId, principal.username)")
    public ResponseEntity updatePosition(@PathVariable("projectId") Long projectId, @PathVariable("stateId") Long stateId, @PathVariable("newPosition") Long newPosition) {
        Long position = newPosition;
        Project project = projectRepository.findOne(projectId);
        State state = repository.findOne(stateId);
        Long oldPosition = state.getPosition();
        if (oldPosition < newPosition) {
            position = oldPosition;
        }
        state.setPosition(newPosition);
        repository.save(state);
        Iterable<State> statesToUpdate = repository.findByProjectAndPositionGreaterThanOrderByPositionAsc(project, position - 1);
        for (State stateToUpdate : statesToUpdate) {
            if (position.equals(newPosition)) {
                position++;
            }
            if (!state.getId().equals(stateToUpdate.getId())) {
                stateToUpdate.setPosition(position);
                repository.save(stateToUpdate);
                position++;
            }
        }
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }

    private Resource<State> getStateResource(State state) {
        return new Resource(state);
    }

    private Resources<Resource<State>> getStateResourceList(Iterable<State> state) {
        return new Resources(state);
    }
}
