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
@RequestMapping(value = "/api/project/{projectId}/task")
@PreAuthorize("@projectAccessExpression.hasMemberAccess(#projectId, principal.username)")
public class TaskListController {

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

        
    @RequestMapping(value="/paged", method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public PagedResources<TaskResource> projectPage(@PathVariable("projectId") Long projectId, Pageable page) {
        Project project = projectRepository.findOne(projectId);
        return pagedAssembler.toResource(repository.findByProject(project, page), assembler);
    }

    @RequestMapping(method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public Iterable<TaskResource> kanbanList(@PathVariable("projectId") Long projectId) {
        Project project = projectRepository.findOne(projectId);
        return assembler.toResources(repository.findByProjectAndStateKanbanHideFalse(project));
    }

    @RequestMapping(method = RequestMethod.POST, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@projectAccessExpression.hasContributorAccess(#projectId, principal.username)")
    public TaskResource create(@PathVariable("projectId") Long projectId, @RequestBody TaskResource task) {
        Task newTask = new Task();
        assembler.updateEntity(newTask, projectId, task);
        Task result = repository.save(newTask);
        return assembler.toResource(result);
    }

}
