/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.parameter;

import java.util.List;
import org.co2.kanban.repository.config.ParameterType;
import org.springframework.hateoas.ResourceSupport;

/**
 *
 * @author granels
 */
public class ParameterByCategoryResource extends ResourceSupport {
    
    private ParameterType category;
    
    private List<ParameterResource> parameter;

    public ParameterType getCategory() {
        return category;
    }

    public void setCategory(ParameterType category) {
        this.category = category;
    }

    public List<ParameterResource> getParameter() {
        return parameter;
    }

    public void setParameter(List<ParameterResource> parameter) {
        this.parameter = parameter;
    }
    
    
}
