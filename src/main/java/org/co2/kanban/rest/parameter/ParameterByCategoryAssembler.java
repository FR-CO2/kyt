/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.parameter;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.co2.kanban.repository.config.ParameterType;
import org.co2.kanban.repository.config.Parameter;
import org.springframework.stereotype.Component;

/**
 *
 * @author granels
 */
@Component
public class ParameterByCategoryAssembler{

    public List<ParameterByCategoryResource> filterByCategory(Iterable<Parameter> entities) {
        List<ParameterByCategoryResource> result = new ArrayList<>();
        Map<ParameterType, List<Parameter>> mapParameter = new HashMap<>();
        for(Parameter parameter : entities){
            if(!mapParameter.containsKey(parameter.getCategory())){
                    mapParameter.put(parameter.getCategory(), new ArrayList<Parameter>());
            }
            mapParameter.get(parameter.getCategory()).add(parameter);
        }
        for (Map.Entry<ParameterType, List<Parameter>> parametersCategory : mapParameter.entrySet()) {
            result.add(toResource(parametersCategory));
        }
        return result;
    }

    public ParameterByCategoryResource toResource(Map.Entry<ParameterType, List<Parameter>> entry) {
        ParameterByCategoryResource resource = new ParameterByCategoryResource();
        List<ParameterResource> list = new ArrayList<>();
        for(Parameter param : entry.getValue()){
            list.add(new ParameterResource(param));
        }
        resource.setCategory(entry.getKey());
        resource.setParameter(list);
        return resource;
    }

}
