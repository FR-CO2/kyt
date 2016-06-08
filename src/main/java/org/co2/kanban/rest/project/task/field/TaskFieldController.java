/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.task.field;

import org.co2.kanban.repository.task.Task;
import org.co2.kanban.repository.task.TaskRepository;
import org.co2.kanban.repository.taskfield.TaskFieldDefinition;
import org.co2.kanban.repository.taskfield.TaskFieldDefinitionRepository;
import org.co2.kanban.repository.taskfield.TaskFieldRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author ben
 */
@RestController
@RequestMapping(value = "/api/project/{projectId}/task/{taskId}/custom")
@PreAuthorize("@projectAccessExpression.hasMemberAccess(#projectId, principal.username)")
public class TaskFieldController {

    @Autowired
    private TaskFieldRepository repository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private TaskFieldDefinitionRepository fieldDefRepository;

    @Autowired
    private TaskFieldAssembler assembler;

    @RequestMapping(method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public Iterable<TaskFieldResource> list(@PathVariable("projectId") Long projectId, @PathVariable("taskId") Long taskId) {
        Task task = taskRepository.findOne(taskId);
        return assembler.toResources(repository.findByTask(task));
    }

    @RequestMapping(value = "/{defId}", method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public TaskFieldResource get(@PathVariable("projectId") Long projectId, @PathVariable("taskId") Long taskId, @PathVariable("defId") Long defId) {
        Task task = taskRepository.findOne(taskId);
        TaskFieldDefinition def = fieldDefRepository.findOne(defId);
        return assembler.toResource(repository.findByDefinitionAndTask(def, task));
    }
}
