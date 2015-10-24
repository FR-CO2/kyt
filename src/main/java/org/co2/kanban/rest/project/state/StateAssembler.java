/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.state;

import org.co2.kanban.repository.state.State;
import org.springframework.hateoas.mvc.ResourceAssemblerSupport;

/**
 *
 * @author ben
 */
public class StateAssembler extends ResourceAssemblerSupport<State, StateResource> {

    public StateAssembler() {
        super(StateController.class, StateResource.class);
    }

    @Override
    public StateResource toResource(State state) {
        return createResourceWithId(state.getId(), state);
    }

}
