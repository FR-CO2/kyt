/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.member;


import java.io.IOException;
import org.co2.kanban.repository.member.Member;
import org.co2.kanban.rest.project.ProjectController;
import org.co2.kanban.rest.project.member.imputation.ImputationController;
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
public class MemberAssembler extends ResourceAssemblerSupport<Member, MemberResource> {

    public MemberAssembler() {
        super(MemberController.class, MemberResource.class);
    }

    @Override
    public MemberResource toResource(Member member) {
        MemberResource resource = new MemberResource(member);
        resource.add(linkTo(methodOn(MemberController.class).get( member.getProject().getId(), member.getId())).withSelfRel());
        resource.add(linkTo(methodOn(ProjectController.class).get(member.getProject().getId())).withRel("project"));
        resource.add(linkTo(methodOn(ApplicationUserController.class).get(member.getUser().getId())).withRel("user"));
        if (member.getUser().getPhoto() != null) {
            try {
                resource.add(linkTo(methodOn(ApplicationUserController.class).getPhoto(member.getUser().getId())).withRel("photo"));
            } catch (IOException ioex) {
                //Todo log error;
            }
        }
        resource.add(linkTo(ImputationController.class, member.getProject().getId(), member.getId()).withRel("imputation"));
        return resource;
    }

}
