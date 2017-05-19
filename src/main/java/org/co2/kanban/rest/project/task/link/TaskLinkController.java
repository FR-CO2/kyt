/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.task.link;

import org.co2.kanban.repository.task.Task;
import org.co2.kanban.repository.task.TaskRepository;
import org.co2.kanban.rest.error.BusinessException;
import org.co2.kanban.rest.project.task.TaskLinkAssembler;
import org.co2.kanban.rest.project.task.TaskLinkResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 *
 * @author courtib
 */
/**
 *
 * @author ben
 */
@RestController
@RequestMapping(value = "/api/project/{projectId}/task/{id}/link")
@PreAuthorize("@projectAccessExpression.hasMemberAccess(#projectId, principal.username)")
public class TaskLinkController {

    private static final String MESSAGE_KEY_NOT_FOUND = "project.task.error.notfound";

    @Autowired
    private TaskRepository repository;

    @Autowired
    private TaskLinkAssembler assembler;

    @RequestMapping(value = "/child", method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public Iterable<TaskLinkResource> children(@PathVariable("projectId") Long projectId, @PathVariable("id") Long taskId) {
        Task task = repository.findOne(taskId);
        if (task == null) {
            throw new BusinessException(HttpStatus.NOT_FOUND, MESSAGE_KEY_NOT_FOUND);
        }
        return assembler.toResources(task.getChildren());
    }

    @RequestMapping(value = "/child/{linkedTaskId}", params = {"linkedTaskId"},  method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public TaskLinkResource getTaskChild(@PathVariable("id") Long taskId, @RequestParam(name = "linkedTaskId") Long linkedTaskId) {
        Task task = repository.findOne(taskId);
        Task childTask = repository.findOne(linkedTaskId);
        if (task == null || childTask == null) {
            throw new BusinessException(HttpStatus.NOT_FOUND, MESSAGE_KEY_NOT_FOUND);
        }
        childTask.getParent().add(task);
        return assembler.toResource(childTask);
    }

    @RequestMapping(value = "/child", method = RequestMethod.POST, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity addChild(@PathVariable("id") Long taskId, @RequestBody Task taskToLink) {
        Task task = repository.findOne(taskId);
        Task childTask = repository.findOne(taskToLink.getId());
        if (task == null || childTask == null) {
            throw new BusinessException(HttpStatus.NOT_FOUND, MESSAGE_KEY_NOT_FOUND);
        }
        task.getChildren().add(childTask);
        repository.save(childTask);
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }

    @RequestMapping(value = "/child/{linkedTaskId}", method = RequestMethod.DELETE, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity removeChild(@PathVariable("id") Long taskId, @PathVariable("linkedTaskId") Long linkedTaskId) {
        Task task = repository.findOne(taskId);
        Task childTask = repository.findOne(linkedTaskId);
        if (task == null || childTask == null) {
            throw new BusinessException(HttpStatus.NOT_FOUND, MESSAGE_KEY_NOT_FOUND);
        }
        task.getChildren().remove(childTask);
        repository.save(childTask);
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }

    @RequestMapping(value = "/parent", method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public Iterable<TaskLinkResource> parents(@PathVariable("projectId") Long projectId, @PathVariable("id") Long taskId) {
        Task task = repository.findOne(taskId);
        if (task == null) {
            throw new BusinessException(HttpStatus.NOT_FOUND, MESSAGE_KEY_NOT_FOUND);
        }
        return assembler.toResources(task.getParent());
    }

    @RequestMapping(value = "/parent/{linkedTaskId}", params = {"linkedTaskId"},  method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public TaskLinkResource getTaskParent(@PathVariable("id") Long taskId, @RequestParam(name = "linkedTaskId") Long linkedTaskId) {
        Task task = repository.findOne(taskId);
        Task parentTask = repository.findOne(linkedTaskId);
        if (task == null || parentTask == null) {
            throw new BusinessException(HttpStatus.NOT_FOUND, MESSAGE_KEY_NOT_FOUND);
        }
        parentTask.getChildren().add(task);
        return assembler.toResource(parentTask);
    }

    @RequestMapping(value = "/parent", method = RequestMethod.POST, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity addParent(@PathVariable("id") Long taskId, @RequestBody Task taskToLink) {
        Task task = repository.findOne(taskId);
        Task parentTask = repository.findOne(taskToLink.getId());
        if (task == null || parentTask == null) {
            throw new BusinessException(HttpStatus.NOT_FOUND, MESSAGE_KEY_NOT_FOUND);
        }
        parentTask.getChildren().add(task);
        repository.save(parentTask);
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }

    @RequestMapping(value = "/parent/{linkedTaskId}", method = RequestMethod.DELETE, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity removeParent(@PathVariable("id") Long taskId, @PathVariable("linkedTaskId") Long linkedTaskId) {
        Task task = repository.findOne(taskId);
        Task parentTask = repository.findOne(linkedTaskId);
        if (task == null || parentTask == null) {
            throw new BusinessException(HttpStatus.NOT_FOUND, MESSAGE_KEY_NOT_FOUND);
        }
        parentTask.getChildren().remove(task);
        repository.save(task);
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }
}
