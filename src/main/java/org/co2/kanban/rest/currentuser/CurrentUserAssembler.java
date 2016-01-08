/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.currentuser;

import org.co2.kanban.repository.user.ApplicationUser;
import org.co2.kanban.rest.user.UserAssembler;
import org.co2.kanban.rest.user.UserResource;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import org.springframework.stereotype.Component;

/**
 *
 * @author ben
 */
@Component
public class CurrentUserAssembler extends UserAssembler {

    @Override
    public UserResource toResource(ApplicationUser user) {
        UserResource resource = new UserResource(user);
        resource.add(linkTo(CurrentUserController.class).withSelfRel());
        resource.add(getLinks(user));
        return resource;
    }

}
