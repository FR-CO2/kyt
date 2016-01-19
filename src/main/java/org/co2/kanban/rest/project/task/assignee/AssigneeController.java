/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.task.assignee;

import org.co2.kanban.repository.task.Task;
import org.co2.kanban.repository.task.TaskRepository;
import org.co2.kanban.rest.project.member.MemberAssembler;
import org.co2.kanban.rest.project.member.MemberResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
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
@RequestMapping(value = "/api/project/{projectId}/task/{taskId}/assignee")
@PreAuthorize("@projectAccessExpression.hasContributorAccess(#projectId, principal.username)")
public class AssigneeController {
    
    @Autowired
    private TaskRepository repository;
    
    @Autowired
    private MemberAssembler assembler;
    
    @RequestMapping(method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public Iterable<MemberResource> list(@PathVariable("projectId") Long projectId, @PathVariable("taskId") Long taskId) {
        Task task = repository.findOne(taskId);
        return assembler.toResources(task.getAssignees());
    }

    @RequestMapping(value = "/{memberId}", method = RequestMethod.POST, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public HttpEntity assignee(@PathVariable("projectId") Long projectId, @PathVariable("taskId") Long taskId, @PathVariable("memberId") Long memberId) {
        return new HttpEntity(HttpStatus.OK);
    }

    @RequestMapping(value = "/{memberId}", method = RequestMethod.DELETE, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public HttpEntity remove(@PathVariable("projectId") Long projectId, @PathVariable("taskId") Long taskId, @PathVariable("memberId") Long memberId) {
        return new HttpEntity(HttpStatus.OK);
    }
}
