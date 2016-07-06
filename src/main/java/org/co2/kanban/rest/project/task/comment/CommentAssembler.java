/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.task.comment;

import org.co2.kanban.repository.comment.Comment;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;
import org.springframework.hateoas.mvc.ResourceAssemblerSupport;
import org.springframework.stereotype.Component;

/**
 *
 * @author ben
 */
@Component
public class CommentAssembler extends ResourceAssemblerSupport<Comment, CommentResource> {

    public CommentAssembler() {
        super(CommentController.class, CommentResource.class);
    }

    @Override
    public CommentResource toResource(Comment entity) {
        CommentResource resource = new CommentResource(entity);
        resource.add(linkTo(methodOn(CommentController.class, entity.getTask().getProject().getId(),
                entity.getTask().getId()).get(entity.getTask().getProject().getId(), entity.getId())).withSelfRel());
        return resource;
    }
    
}
