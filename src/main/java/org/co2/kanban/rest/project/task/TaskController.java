/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.task;

import org.co2.kanban.repository.project.Project;
import org.co2.kanban.repository.project.ProjectRepository;
import org.co2.kanban.repository.task.Task;
import org.co2.kanban.repository.task.TaskRepository;
import org.co2.kanban.repository.state.StateRepository;
import org.co2.kanban.repository.swimlane.SwimlaneRepository;
import org.springframework.beans.factory.annotation.Autowired;
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
    private TaskAssembler assembler;

    @RequestMapping(method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public TaskResource get(@PathVariable("id") Long taskId) {
        return assembler.toResource(repository.findOne(taskId));
    }

    @RequestMapping(method = RequestMethod.DELETE, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@projectAccessExpression.hasContributorAccess(#projectId, principal.username)")
    public ResponseEntity delete(@PathVariable("id") Long id) {
        repository.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @RequestMapping(method = RequestMethod.POST, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public TaskResource update(@PathVariable("projectId") Long projectId, @PathVariable("id") Long taskId, @RequestBody Task task) {
        Project project = projectRepository.findOne(projectId);
        task.setProject(project);
        Task result = repository.save(task);
        return assembler.toResource(result);
    }

}
