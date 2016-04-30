/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.parameter;

import org.co2.kanban.repository.config.Parameter;
import org.springframework.hateoas.mvc.ResourceAssemblerSupport;
import org.springframework.stereotype.Component;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;

/**
 *
 * @author ben
 */
@Component
public class ParameterAssembler extends ResourceAssemblerSupport<Parameter, ParameterResource> {

    public ParameterAssembler() {
        super(ParameterController.class, ParameterResource.class);
    }

    @Override
    public ParameterResource toResource(Parameter config) {
        ParameterResource resource = new ParameterResource(config);
        resource.add(linkTo(methodOn(ParameterController.class).getByName(config.getCategory(), config.getKeyParam())).withSelfRel());
        return resource;
    }
}
