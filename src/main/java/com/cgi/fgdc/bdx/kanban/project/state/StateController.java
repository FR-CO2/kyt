/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.cgi.fgdc.bdx.kanban.project.state;

import com.cgi.fgdc.bdx.kanban.project.Project;
import com.cgi.fgdc.bdx.kanban.project.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
public class StateController {

    @Autowired
    private StateRepository repository;

    @Autowired
    private ProjectRepository projectRepository;

    @RequestMapping(method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public Iterable<State> projectList(@PathVariable("projectId") Long projectId) {
        Project project = projectRepository.findOne(projectId);
        return repository.findByProjectOrderByPositionAsc(project);
    }

    @RequestMapping(value = "{id}", method = RequestMethod.DELETE, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity delete(@PathVariable("id") Long id) {
        repository.delete(id);
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }

    @RequestMapping(method = RequestMethod.POST, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
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
}
