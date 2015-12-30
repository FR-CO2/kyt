/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.user;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

import org.co2.kanban.repository.user.ApplicationUser;
import org.co2.kanban.rest.project.ProjectController;
import org.co2.kanban.rest.user.consommation.UserConsommationController;
import org.co2.kanban.rest.user.memberof.MemberOfController;
import org.co2.kanban.rest.user.task.UserTaskController;
import org.springframework.hateoas.mvc.ResourceAssemblerSupport;
import org.springframework.stereotype.Component;

/**
 *
 * @author ben
 */
@Component
public class UserAssembler extends ResourceAssemblerSupport<ApplicationUser, UserResource> {

    public UserAssembler() {
        super(ApplicationUserController.class, UserResource.class);
    }

    @Override
    public UserResource toResource(ApplicationUser user) {
        UserResource resource = new UserResource(user);
        resource.add(linkTo(methodOn(ApplicationUserController.class).get(user.getId())).withSelfRel());
        resource.add(linkTo(MemberOfController.class, user.getId()).withRel("member"));
        resource.add(linkTo(ProjectController.class).withRel("project"));
        resource.add(linkTo(UserTaskController.class, user.getId()).withRel("task"));
        resource.add(linkTo(UserConsommationController.class, user.getId()).withRel("consommation"));
        return resource;
    }

}
