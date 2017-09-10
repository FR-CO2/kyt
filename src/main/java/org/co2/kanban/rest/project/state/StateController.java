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
import org.co2.kanban.rest.error.BusinessException;
import org.springframework.beans.factory.annotation.Autowired;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;
import org.springframework.http.HttpHeaders;
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

    private static final String MESSAGE_KEY_CONFLICT_NAME = "project.state.error.conflict.name";
    
    private static final String MESSAGE_KEY_PRECONDITION_DELETE = "project.state.error.precondition.delete";
    
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
        Boolean hide = !kanban;
        return assembler.toResources(repository.findByProjectAndKanbanHideOrderByPositionAsc(project, hide));
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StateResource> get(@PathVariable("projectId") Long projectId, @PathVariable("id") Long id) {
        State state = repository.findOne(id);
        return new ResponseEntity(assembler.toResource(state), HttpStatus.OK);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@projectAccessExpression.hasManagerAccess(#projectId, principal.username)")
    public ResponseEntity delete(@PathVariable("projectId") Long projectId, @PathVariable("id") Long id) {
        State state = repository.findOne(id);
        //Precondition : no task exist with state 
        if (!state.getTasks().isEmpty()) {
            throw new BusinessException(HttpStatus.PRECONDITION_FAILED, MESSAGE_KEY_PRECONDITION_DELETE);
        }
        repository.delete(id);
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }

    @RequestMapping(method = RequestMethod.POST, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@projectAccessExpression.hasManagerAccess(#projectId, principal.username)")
    public ResponseEntity create(@PathVariable("projectId") Long projectId, @RequestBody State state) {
        Project project = projectRepository.findOne(projectId);
        if (repository.checkExistProjectAndName(project, state.getName())) {
            throw new BusinessException(HttpStatus.CONFLICT, MESSAGE_KEY_CONFLICT_NAME);
        }
        state.setProject(project);
        Long maxPosition = repository.getProjectMaxPosition(project);
        if (maxPosition == null) {
            maxPosition = 0L;
        }
        state.setPosition(maxPosition);
        State result = repository.save(state);
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(linkTo(methodOn(this.getClass(), projectId).get(projectId, result.getId())).toUri());
        return new ResponseEntity<>(headers, HttpStatus.CREATED);
    }

    @RequestMapping(value = "/{stateId}", method = RequestMethod.POST, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@projectAccessExpression.hasManagerAccess(#projectId, principal.username)")
    public ResponseEntity update(@PathVariable("projectId") Long projectId, @RequestBody State state) {
        Project project = projectRepository.findOne(projectId);
        State oldState = repository.findOne(state.getId());
        if (!oldState.getName().equals(state.getName()) && repository.checkExistProjectAndName(project, state.getName())) {
            throw new BusinessException(HttpStatus.CONFLICT, MESSAGE_KEY_CONFLICT_NAME);
        }
        if (!oldState.getPosition().equals(state.getPosition())) {
            updatePosition(state.getPosition(), oldState);
        }
        state.setProject(project);
        repository.save(state);
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
        Iterable<State> statesToUpdate = repository.findByProjectAndPositionGreaterThanEqualOrderByPositionAsc(state.getProject(), positionRef);
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
