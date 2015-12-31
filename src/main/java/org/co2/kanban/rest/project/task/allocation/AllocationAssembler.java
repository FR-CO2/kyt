/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.task.allocation;

import org.co2.kanban.repository.allocation.Allocation;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;
import org.springframework.hateoas.mvc.ResourceAssemblerSupport;
import org.springframework.stereotype.Component;

/**
 *
 * @author ben
 */
@Component
public class AllocationAssembler extends ResourceAssemblerSupport<Allocation, AllocationResource> {

    public AllocationAssembler() {
        super(AllocationController.class, AllocationResource.class);
    }

    @Override
    public AllocationResource toResource(Allocation entity) {
        AllocationResource resource = new AllocationResource(entity);
        resource.add(linkTo(methodOn(AllocationController.class, entity.getTask().getProject().getId(), entity.getTask().getId()).get(entity.getTask().getProject().getId(), entity.getId())).withSelfRel());
        return resource;
    }

}
