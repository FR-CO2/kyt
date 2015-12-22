/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.swimlane;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

import org.co2.kanban.repository.swimlane.Swimlane;
import org.co2.kanban.rest.project.ProjectController;
import org.co2.kanban.rest.project.member.MemberController;
import org.springframework.hateoas.mvc.ResourceAssemblerSupport;
import org.springframework.stereotype.Component;

/**
 *
 * @author ben
 */
@Component
public class SwimlaneAssembler extends ResourceAssemblerSupport<Swimlane, SwimlaneResource> {

    public SwimlaneAssembler() {
        super(SwimlaneController.class, SwimlaneResource.class);
    }

    @Override
    public SwimlaneResource toResource(Swimlane swimlane) {
        SwimlaneResource resource = new SwimlaneResource(swimlane);
        resource.setTaskCount(swimlane.getTasks().size());
        resource.add(linkTo(methodOn(SwimlaneController.class, swimlane.getProject().getId()).get(swimlane.getId())).withSelfRel());
        resource.add(linkTo(methodOn(ProjectController.class).get(swimlane.getProject().getId())).withRel("project"));
        if (swimlane.getResponsable() != null) {
            resource.add(linkTo(methodOn(MemberController.class).get(swimlane.getResponsable().getId())).withRel("responsable"));
        }
        return resource;
    }
}
