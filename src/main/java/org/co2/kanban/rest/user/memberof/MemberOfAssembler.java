/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.user.memberof;

import org.co2.kanban.repository.member.Member;
import org.co2.kanban.rest.project.ProjectController;
import org.co2.kanban.rest.project.member.MemberController;
import org.co2.kanban.rest.user.ApplicationUserController;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;
import org.springframework.hateoas.mvc.ResourceAssemblerSupport;
import org.springframework.stereotype.Component;

/**
 *
 * @author ben
 */
@Component
public class MemberOfAssembler extends ResourceAssemblerSupport<Member, MemberOfResource> {

    public MemberOfAssembler() {
        super(MemberController.class, MemberOfResource.class);
    }

    @Override
    public MemberOfResource toResource(Member entity) {
        if (entity == null) {
            return null;
        }
        MemberOfResource resource = new MemberOfResource(entity);
        resource.add(linkTo(methodOn(ProjectController.class).get(entity.getProject().getId())).withRel("project"));
        resource.add(linkTo(methodOn(ApplicationUserController.class).get(entity.getUser().getId())).withRel("user"));
        return resource;
    }

}
