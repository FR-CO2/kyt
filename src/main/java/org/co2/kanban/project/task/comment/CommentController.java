/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.project.task.comment;

import java.security.Principal;
import org.co2.kanban.project.security.Member;
import org.co2.kanban.project.security.MemberRepository;
import org.co2.kanban.project.task.Task;
import org.co2.kanban.project.task.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.web.bind.annotation.AuthenticationPrincipal;
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
@RequestMapping(value = "/api/project/{projectId}/task/{taskId}/comment")
@PreAuthorize("@projectAccessExpression.hasMemberAccess(#projectId, principal.username)")
public class CommentController {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private MemberRepository memberRepository;
    
    @Autowired
    private CommentRepository repository;

    @RequestMapping(method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public Iterable<Comment> projectList(@PathVariable("taskId") Long taskId) {
        Task task = taskRepository.findOne(taskId);
        return task.getComments();
    }

    @RequestMapping(method = RequestMethod.POST, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Comment> create(@AuthenticationPrincipal Principal user, @PathVariable("taskId") Long taskId, @RequestBody Comment form) {
        Task task = taskRepository.findOne(taskId);
        Member member = memberRepository.findByProjectIdAndUserUsername(task.getProject().getId(), user.getName());
        form.setTask(task);
        form.setWriter(member);
        Comment comment = repository.save(form);
        return new ResponseEntity<>(comment, HttpStatus.CREATED);
    }

    @RequestMapping(value = "{commentId}", method = RequestMethod.PUT, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Comment> update(@AuthenticationPrincipal Principal user, @PathVariable("taskId") Long taskId, @PathVariable("commentId") Long commentId, Comment form) {
        Task task = taskRepository.findOne(taskId);
        Comment comment = repository.findOne(commentId);
        Member member = memberRepository.findByProjectIdAndUserUsername(task.getProject().getId(), user.getName());
        comment.setTask(task);
        comment.setWriter(member);
        comment.setComment(form.getComment());
        comment.setWritingDate(form.getWritingDate());
        repository.save(form);
        return new ResponseEntity<>(comment, HttpStatus.OK);
    }
}
