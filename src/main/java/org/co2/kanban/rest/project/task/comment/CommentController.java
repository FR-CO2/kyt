/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.task.comment;

import java.security.Principal;
import java.sql.Timestamp;
import java.util.Date;
import org.co2.kanban.repository.comment.Comment;
import org.co2.kanban.repository.comment.CommentRepository;
import org.co2.kanban.repository.task.Task;
import org.co2.kanban.repository.task.TaskRepository;
import org.co2.kanban.repository.user.ApplicationUser;
import org.co2.kanban.repository.user.ApplicationUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
    private ApplicationUserRepository userRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private CommentRepository repository;

    @Autowired
    private CommentAssembler assembler;

    @RequestMapping(method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public Iterable<CommentResource> comments(@PathVariable("projectId") Long projectId, @PathVariable("taskId") Long taskId) {
        Task task = taskRepository.findOne(taskId);
        Iterable<Comment> comments = repository.findByTask(task);
        return assembler.toResources(comments);
    }

    @RequestMapping(value = "/{commentId}", method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public CommentResource get(@PathVariable("projectId") Long projectId, @PathVariable("commentId") Long commentId) {
        Comment comment = repository.findOne(commentId);
        return assembler.toResource(comment);
    }

    @RequestMapping(value = "/{commentId}", method = RequestMethod.DELETE, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@projectAccessExpression.hasManagerAccess(#projectId, principal.username)")
    public ResponseEntity delete(@PathVariable("projectId") Long projectId, @PathVariable("commentId") Long commentId) {
        repository.delete(commentId);
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }

    @RequestMapping(method = RequestMethod.POST, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity create(@PathVariable("projectId") Long projectId, @AuthenticationPrincipal Principal user, @PathVariable("taskId") Long taskId, @RequestBody CommentResource comment) {
        Task task = taskRepository.findOne(taskId);
        ApplicationUser writer = userRepository.findByUsername(user.getName());
        Comment creatingComment = new Comment();
        creatingComment.setTask(task);
        Comment.CommentContent content = new Comment.CommentContent();
        content.setWriter(writer);
        content.setWritingDate(new Timestamp(new Date().getTime()));
        content.setComment(comment.getComment());
        creatingComment.setContent(content);
        repository.save(creatingComment);
        return new ResponseEntity(HttpStatus.CREATED);
    }

}
