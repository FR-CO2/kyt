/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.user;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

import org.co2.kanban.repository.user.ApplicationUser;
import org.co2.kanban.rest.project.ProjectController;
import org.co2.kanban.rest.search.TaskSearchController;
import org.co2.kanban.rest.user.consommation.UserConsommationController;
import org.co2.kanban.rest.user.memberof.MemberOfController;
import org.co2.kanban.rest.user.task.UserTaskController;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.mvc.ResourceAssemblerSupport;
import org.springframework.stereotype.Component;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;

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
        resource.add(getLinks(user));
        return resource;
    }

    protected Iterable<Link> getLinks(ApplicationUser user) {
        List<Link> links = new ArrayList<>();
        links.add(linkTo(MemberOfController.class, user.getId()).withRel("member"));
        links.add(linkTo(ProjectController.class).withRel("project"));
        links.add(linkTo(UserTaskController.class, user.getId()).withRel("task"));
        links.add(linkTo(TaskSearchController.class, user.getId()).withRel("search"));
        links.add(linkTo(UserConsommationController.class, user.getId()).withRel("consommation"));
        if (user.getPhoto() != null) {
            try {
                links.add(linkTo(methodOn(ApplicationUserController.class).getPhoto(user.getId())).withRel("photo"));
            } catch (IOException ioex) {
                //Todo log error;
            }
        }
        return links;
    }
}
