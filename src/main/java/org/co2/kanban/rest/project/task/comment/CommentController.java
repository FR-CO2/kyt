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
    private TaskRepository taskRepository;

    @Autowired
    private CommentRepository repository;

    @Autowired
    private CommentAssembler assembler;
    
    @RequestMapping(method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public Iterable<CommentResource> comments(@PathVariable("taskId") Long taskId) {
        Task task = taskRepository.findOne(taskId);
        return assembler.toResources(task.getComments());
    }

    @RequestMapping(method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public CommentResource get(@PathVariable("commentId") Long commentId) {
        Comment comment = repository.findOne(commentId);
        return assembler.toResource(comment);
    }

    @RequestMapping(method = RequestMethod.POST, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity create(@AuthenticationPrincipal Principal user, @PathVariable("taskId") Long taskId, @RequestBody Comment comment) {
        Task task = taskRepository.findOne(taskId);
        comment.setTask(task);
        comment.setWriter(user.getName());
        comment.setWritingDate(new Timestamp(new Date().getTime()));
        repository.save(comment);
        return new ResponseEntity(HttpStatus.CREATED);
    }

    @RequestMapping(value = "{commentId}/reply", method = RequestMethod.POST, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity reply(@AuthenticationPrincipal Principal user, @PathVariable("taskId") Long taskId, @PathVariable("commentId") Long parentCommentId, @RequestBody Comment comment) {
        Comment parent = repository.findOne(parentCommentId);
        comment.setWriter(user.getName());
        comment.setWritingDate(new Timestamp(new Date().getTime()));
        comment.setParent(parent);
        repository.save(comment);
        return new ResponseEntity(HttpStatus.CREATED);
    }

    @RequestMapping(value = "/{commentId}/reply", method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public Iterable<CommentResource> listReplies(@PathVariable("commentId") Long commentId) {
        Comment parent = repository.findOne(commentId);
        return assembler.toResources(parent.getReply());
    }
}
