/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.task;

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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author ben
 */
@RestController
@RequestMapping(value = "/api/project/{projectId}/task")
@PreAuthorize("@projectAccessExpression.hasMemberAccess(#projectId, principal.username)")
public class TaskListController {

    @Autowired
    private TaskRepository repository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private StateRepository stateRepository;
    
    @Autowired
    private SwimlaneRepository swimlaneRepository;
    
    @Autowired
    private PagedResourcesAssembler<Task> pagedAssembler;

    @Autowired
    private TaskAssembler assembler;

    @RequestMapping(value = "/paged", method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public PagedResources<TaskResource> page(@PathVariable("projectId") Long projectId, Pageable page) {
        Project project = projectRepository.findOne(projectId);
        return pagedAssembler.toResource(repository.findByProject(project, page), assembler);
    }

    @RequestMapping(method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public Iterable<TaskResource> list(@PathVariable("projectId") Long projectId,
            @RequestParam(name="state", required = false) Long stateId,
            @RequestParam(name="swimlane", required = false) Long swimlaneId) {
        Iterable<TaskResource> tasks;
        Project project = projectRepository.findOne(projectId);
        State state = stateRepository.findOne(stateId);
        if (swimlaneId == null) {
            tasks = assembler.toResources(repository.findByProjectAndState(project, state));
        } else {
            Swimlane swimlane = swimlaneRepository.findOne(swimlaneId);
            tasks = assembler.toResources(repository.findByProjectAndStateAndSwimlane(project, state, swimlane));
        }
        return tasks;
    }

    @RequestMapping(method = RequestMethod.POST, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@projectAccessExpression.hasContributorAccess(#projectId, principal.username)")
    public TaskResource create(@PathVariable("projectId") Long projectId, @RequestBody Task task) {
        Project project = projectRepository.findOne(projectId);
        task.setProject(project);
        State defaultState = stateRepository.findByProjectAndPosition(project, 0L);
        task.setState(defaultState);
        Task result = repository.save(task);
        return assembler.toResource(result);
    }

}
