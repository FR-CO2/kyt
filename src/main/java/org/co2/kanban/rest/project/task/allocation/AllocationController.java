/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.task.allocation;

import org.co2.kanban.repository.allocation.AllocationRepository;
import org.co2.kanban.repository.allocation.Allocation;
import org.co2.kanban.repository.task.Task;
import org.co2.kanban.repository.task.TaskRepository;
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
@RequestMapping(value = "/api/project/{projectId}/task/{taskId}/allocation")
@PreAuthorize("@projectAccessExpression.hasMemberAccess(#projectId, principal.username)")
public class AllocationController {

    @Autowired
    private TaskRepository repository;

    @Autowired
    private AllocationRepository allocationRepository;

    @Autowired
    private AllocationAssembler assembler;

    @RequestMapping(method = RequestMethod.POST, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@projectAccessExpression.hasManagerAccess(#projectId, principal.username)")
    public ResponseEntity create(@PathVariable("projectId") Long projectId, @PathVariable("taskId") Long taskId, @RequestBody Allocation allocation) {
        Task task = repository.findOne(taskId);
        allocation.setTask(task);
        if (allocation.getTimeSpent() != null) {
            allocationRepository.save(allocation);
            return new ResponseEntity(HttpStatus.CREATED);
        }
        return new ResponseEntity<>(HttpStatus.NOT_MODIFIED);
    }

    @RequestMapping(method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public Iterable<AllocationResource> list(@PathVariable("projectId") Long projectId, @PathVariable("taskId") Long taskId) {
        Task task = repository.findOne(taskId);
        return assembler.toResources(allocationRepository.findByTask(task));
    }

    @RequestMapping(value = "/{allocationId}", method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public AllocationResource get(@PathVariable("projectId") Long projectId, @PathVariable("allocationId") Long allocationId) {
        return assembler.toResource(allocationRepository.findOne(allocationId));
    }

    @RequestMapping(value = "/{allocationId}", method = RequestMethod.DELETE, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@projectAccessExpression.hasManagerAccess(#projectId, principal.username)")
    public ResponseEntity delete(@PathVariable("projectId") Long projectId, @PathVariable("allocationId") Long allocationId) {
        allocationRepository.delete(allocationId);
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }

}
