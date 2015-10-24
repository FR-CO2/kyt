/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.user;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

import org.co2.kanban.repository.user.ApplicationUser;
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
        UserResource resource = createResourceWithId(user.getId(), user);
        resource.setUsername(user.getUsername());
        resource.setEmail(user.getEmail());
        resource.setApplicationRole(user.getApplicationRole());
        resource.add(linkTo(methodOn(ApplicationUserController.class).memberOf(user.getId())).withRel("members"));
        resource.add(linkTo(methodOn(ApplicationUserController.class).listProject(user.getId(), null)).withRel("project"));
        resource.add(linkTo(methodOn(ApplicationUserController.class).listTask(user.getId(), null)).withRel("task"));
        return resource;
    }

}
