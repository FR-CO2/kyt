/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.parameter;

import org.co2.kanban.repository.config.Parameter;
import org.co2.kanban.repository.config.ParameterType;
import org.co2.kanban.rest.IdentifiableResourceSupport;

/**
 *
 * @author ben
 */
public class ParameterResource extends IdentifiableResourceSupport<Parameter> {

    public ParameterResource(Parameter config) {
        super(config);
    }
    
    public String getValueParam() {
        return this.getBean().getValueParam();
    }

    public ParameterType getCategory() {
        return this.getBean().getCategory();
    }
    
    public String getKeyParam(){
        return this.getBean().getKeyParam();
    }
}
