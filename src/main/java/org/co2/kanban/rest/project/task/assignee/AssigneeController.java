/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.task.assignee;

import org.co2.kanban.repository.member.ProjectMember;
import org.co2.kanban.repository.task.Task;
import org.co2.kanban.repository.task.TaskRepository;
import org.co2.kanban.rest.error.BusinessException;
import org.co2.kanban.rest.project.member.MemberAssembler;
import org.co2.kanban.rest.project.member.MemberResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
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
@RequestMapping(value = "/api/project/{projectId}/task/{taskId}/assignee")
@PreAuthorize("@projectAccessExpression.hasContributorAccess(#projectId, principal.username)")
public class AssigneeController {

    private static final String MESSAGE_KEY_TASK_NOT_FOUND = "project.task.error.notfound";

    private static final String MESSAGE_KEY_MEMBER_CONFLICT = "project.task.error.assignee.conflict";

    @Autowired
    private TaskRepository repository;

    @Autowired
    private MemberAssembler assembler;

    @RequestMapping(method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public Iterable<MemberResource> list(@PathVariable("projectId") Long projectId, @PathVariable("taskId") Long taskId) {
        Task task = repository.findOne(taskId);
        if (task == null) {
            throw new BusinessException(HttpStatus.NOT_FOUND, MESSAGE_KEY_TASK_NOT_FOUND);
        }
        return assembler.toResources(task.getAssignees());
    }

    @RequestMapping(method = RequestMethod.POST, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public HttpEntity assignee(@PathVariable("projectId") Long projectId, @PathVariable("taskId") Long taskId, @RequestBody ProjectMember member) {
        Task task = repository.findOne(taskId);
        if (task == null) {
            throw new BusinessException(HttpStatus.NOT_FOUND, MESSAGE_KEY_TASK_NOT_FOUND);
        }
        if (task.getAssignees().contains(member)) {
            throw new BusinessException(HttpStatus.CONFLICT, MESSAGE_KEY_MEMBER_CONFLICT);
        }
        task.getAssignees().add(member);
        repository.save(task);
        return new HttpEntity(HttpStatus.OK);
    }

    @RequestMapping(method = RequestMethod.DELETE, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public HttpEntity remove(@PathVariable("projectId") Long projectId, @PathVariable("taskId") Long taskId, @RequestBody ProjectMember member) {
        Task task = repository.findOne(taskId);
        if (task == null) {
            throw new BusinessException(HttpStatus.NOT_FOUND, MESSAGE_KEY_TASK_NOT_FOUND);
        }
        task.getAssignees().remove(member);
        repository.save(task);
        return new HttpEntity(HttpStatus.OK);
    }
}
