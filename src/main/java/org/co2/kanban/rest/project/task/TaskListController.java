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
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedResources;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
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

    @RequestMapping(params = {"page", "size"}, method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public PagedResources<TaskResource> page(@PathVariable("projectId") Long projectId,
            @RequestParam(name = "page") Integer page,
            @RequestParam(name = "size") Integer size,
            @RequestParam(name = "sort", required = false) String sort,
            @RequestParam(name = "sortDirection", required = false) String sortDirection) {
        Project project = projectRepository.findOne(projectId);
        Sort sorting = null;
        if (sort != null) {
            Sort.Direction dir = Sort.DEFAULT_DIRECTION;
            if (sortDirection != null) {
                dir = Sort.Direction.fromString(sortDirection);
            }
            sorting = new Sort(dir, sort);
        }
        PageRequest pageable = new PageRequest(page, size, sorting);
        return pagedAssembler.toResource(repository.findByProject(project, pageable), assembler);
    }

    @RequestMapping(params = {"noswimlane"}, method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public Iterable<TaskResource> listNoSwimlane(@PathVariable("projectId") Long projectId) {
        Iterable<TaskResource> tasks;
        Project project = projectRepository.findOne(projectId);
        tasks = assembler.toResources(repository.findByProjectAndSwimlaneIsNull(project));
        return tasks;
    }

    @RequestMapping(params = {"state", "noswimlane"}, method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public Iterable<TaskResource> listByStateAndNoSwimlane(@PathVariable("projectId") Long projectId,
            @RequestParam(name = "state") Long stateId) {
        Iterable<TaskResource> tasks;
        Project project = projectRepository.findOne(projectId);
        State state = stateRepository.findOne(stateId);
        tasks = assembler.toResources(repository.findByProjectAndStateAndSwimlaneIsNull(project, state));
        return tasks;
    }

    @RequestMapping(params = {"swimlane"}, method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public Iterable<TaskResource> listBySwimlane(@PathVariable("projectId") Long projectId,
            @RequestParam(name = "swimlane") Long swimlaneId) {
        Iterable<TaskResource> tasks;
        Project project = projectRepository.findOne(projectId);
        Swimlane swimlane = swimlaneRepository.findOne(swimlaneId);
        tasks = assembler.toResources(repository.findByProjectAndSwimlane(project, swimlane));
        return tasks;
    }

    @RequestMapping(params = {"state", "swimlane"}, method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public Iterable<TaskResource> listByStateAndSwimlane(@PathVariable("projectId") Long projectId,
            @RequestParam(name = "state") Long stateId,
            @RequestParam(name = "swimlane") Long swimlaneId) {
        Iterable<TaskResource> tasks;
        Project project = projectRepository.findOne(projectId);
        State state = stateRepository.findOne(stateId);
        Swimlane swimlane = swimlaneRepository.findOne(swimlaneId);
        tasks = assembler.toResources(repository.findByProjectAndStateAndSwimlane(project, state, swimlane));
        return tasks;
    }

    @RequestMapping(method = RequestMethod.POST, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@projectAccessExpression.hasContributorAccess(#projectId, principal.username)")
    public ResponseEntity create(@PathVariable("projectId") Long projectId, @Validated @RequestBody Task task) {
        Project project = projectRepository.findOne(projectId);
        task.setProject(project);
        State defaultState = stateRepository.findByProjectAndPosition(project, 0L);
        task.setState(defaultState);
        Task result = repository.save(task);
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(linkTo(methodOn(TaskController.class).get(result.getProject().getId(), result.getId())).toUri());
        return new ResponseEntity<>(headers, HttpStatus.CREATED);
    }

}
