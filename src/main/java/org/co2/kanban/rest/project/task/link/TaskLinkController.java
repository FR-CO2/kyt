/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.task.link;

import org.co2.kanban.repository.task.Task;
import org.co2.kanban.repository.task.TaskRepository;
import org.co2.kanban.rest.error.BusinessException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.ResourceSupport;
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
    private TaskChildrenAssembler childrenAssembler;

    @Autowired
    private TaskChildrenAssembler parentAssembler;

    @RequestMapping(value = "child", method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResourceSupport children(@PathVariable("projectId") Long projectId, @PathVariable("id") Long taskId) {
        Task task = repository.findOne(taskId);
        if (task == null) {
            throw new BusinessException(HttpStatus.NOT_FOUND, MESSAGE_KEY_NOT_FOUND);
        }
        return childrenAssembler.toResource(task);
    }

    @RequestMapping(value = "child", method = RequestMethod.POST, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity addChild(@PathVariable("id") Long taskId, @RequestBody Task taskToLink) {
        Task task = repository.findOne(taskId);
        Task childTask = repository.findOne(taskToLink.getId());
        if (task == null || childTask == null) {
            throw new BusinessException(HttpStatus.NOT_FOUND, MESSAGE_KEY_NOT_FOUND);
        }
        childTask.getParent().add(task);
        repository.save(taskToLink);
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }

    @RequestMapping(value = "/child/{linkedTaskId}", method = RequestMethod.DELETE, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity removeChild(@PathVariable("id") Long taskId, @PathVariable("linkedTaskId") Long linkedTaskId) {
        Task task = repository.findOne(taskId);
        Task childTask = repository.findOne(linkedTaskId);
        if (task == null || childTask == null) {
            throw new BusinessException(HttpStatus.NOT_FOUND, MESSAGE_KEY_NOT_FOUND);
        }
        childTask.getParent().remove(task);
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }

    @RequestMapping(value = "parent", method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResourceSupport parents(@PathVariable("projectId") Long projectId, @PathVariable("id") Long taskId) {
        Task task = repository.findOne(taskId);
        if (task == null) {
            throw new BusinessException(HttpStatus.NOT_FOUND, MESSAGE_KEY_NOT_FOUND);
        }
        return parentAssembler.toResource(task);
    }

}
