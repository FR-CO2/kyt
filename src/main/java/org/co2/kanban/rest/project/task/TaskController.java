/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.task;

import java.util.List;
import org.co2.kanban.repository.category.Category;
import org.co2.kanban.repository.category.CategoryRepository;
import org.co2.kanban.repository.task.Task;
import org.co2.kanban.repository.task.TaskRepository;
import org.co2.kanban.repository.project.Project;
import org.co2.kanban.repository.project.ProjectRepository;
import org.co2.kanban.repository.state.State;
import org.co2.kanban.repository.state.StateRepository;
import org.co2.kanban.repository.swimlane.Swimlane;
import org.co2.kanban.repository.swimlane.SwimlaneRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedResources;
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
@RequestMapping(value = "/api/project/{projectId}/task/{id}")
@PreAuthorize("@projectAccessExpression.hasMemberAccess(#projectId, principal.username)")
public class TaskController {

    @Autowired
    private TaskRepository repository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private StateRepository taskStateRepository;

    @Autowired
    private SwimlaneRepository swimlaneRepository;

    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @Autowired
    private PagedResourcesAssembler<Task> pagedAssembler;

    @Autowired
    private TaskAssembler assembler;

    
    @RequestMapping(value = "{id}", method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public TaskResource get(@PathVariable("id") Long taskId) {
        return assembler.toResource(repository.findOne(taskId));
    }

    @RequestMapping(value = "{id}", method = RequestMethod.DELETE, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@projectAccessExpression.hasContributorAccess(#projectId, principal.username)")
    public ResponseEntity delete(@PathVariable("id") Long id) {
        repository.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @RequestMapping(value = "{id}/state/{stateId}", method = RequestMethod.POST, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity updateState(@PathVariable("id") Long id, @PathVariable("stateId") Long stateId) {
        State state = taskStateRepository.findOne(stateId);
        Task task = repository.findOne(id);
        if (state == null || task == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        task.setState(state);
        repository.save(task);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @RequestMapping(value = "{id}/swimlane/{swimlaneId}", method = RequestMethod.POST, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity updateSwimlane(@PathVariable("id") Long id, @PathVariable("swimlaneId") Long swimlaneId) {
        Swimlane swimlane = swimlaneRepository.findOne(swimlaneId);
        Task task = repository.findOne(id);
        if (swimlane == null || task == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        task.setSwimlane(swimlane);
        repository.save(task);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @RequestMapping(value = "{id}/swimlane", method = RequestMethod.DELETE, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity removeSwimlane(@PathVariable("id") Long id) {
        Task task = repository.findOne(id);
        if (task == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        task.setSwimlane(null);
        repository.save(task);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @RequestMapping(value = "{id}", method = RequestMethod.POST, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public TaskResource update(@PathVariable("projectId") Long projectId, @PathVariable("id") Long taskId, @RequestBody Task editTask) {
        Task result = repository.save(editTask);
        return assembler.toResource(result);
    }

}
