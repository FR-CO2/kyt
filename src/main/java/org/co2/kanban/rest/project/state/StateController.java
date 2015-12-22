/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.state;

import java.util.List;
import org.co2.kanban.repository.state.State;
import org.co2.kanban.repository.state.StateRepository;
import org.co2.kanban.repository.project.Project;
import org.co2.kanban.repository.project.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
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

    @Autowired
    private StateAssembler assembler;

    @RequestMapping(method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public List<StateResource> projectList(@PathVariable("projectId") Long projectId) {
        Project project = projectRepository.findOne(projectId);
        return assembler.toResources(repository.findByProjectOrderByPositionAsc(project));
    }

    @RequestMapping(params = {"kanban"}, method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public List<StateResource> kanbanList(@PathVariable("projectId") Long projectId, @RequestParam(name = "kanban") Boolean kanban) {
        Project project = projectRepository.findOne(projectId);
        return assembler.toResources(repository.findByProjectAndKanbanHideFalseOrderByPositionAsc(project));
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StateResource> get(@PathVariable("id") Long id) {
        State state = repository.findOne(id);
        return new ResponseEntity(assembler.toResource(state), HttpStatus.OK);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
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
        return new ResponseEntity(HttpStatus.CREATED);
    }

    @RequestMapping(value = "/{stateId}", method = RequestMethod.POST, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@projectAccessExpression.hasManagerAccess(#projectId, principal.username)")
    public ResponseEntity update(@PathVariable("projectId") Long projectId, @RequestBody State state) {

        Project project = projectRepository.findOne(projectId);
        State oldState = repository.findOne(state.getId());
        if (!oldState.getPosition().equals(state.getPosition())) {
            updatePosition(state.getPosition(), oldState);
        }
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }
    
    private void updatePosition(Long newPosition, State state) {
        Long positionRef = newPosition;
        Long oldPosition = state.getPosition();
        if (oldPosition < newPosition) {
            positionRef = oldPosition;
        }
        state.setPosition(newPosition);
        repository.save(state);
        Iterable<State> statesToUpdate = repository.findByProjectAndPositionGreaterThanOrderByPositionAsc(state.getProject(), positionRef - 1);
        for (State stateToUpdate : statesToUpdate) {
            if (positionRef.equals(newPosition)) {
                positionRef++;
            }
            if (!state.getId().equals(stateToUpdate.getId())) {
                stateToUpdate.setPosition(positionRef);
                repository.save(stateToUpdate);
                positionRef++;
            }
        }
    }
}
