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
import org.springframework.hateoas.mvc.ResourceAssemblerSupport;

/**
 *
 * @author granels
 */
public class ParameterByCategoryAssembler{

    public List<ParameterByCategoryResource> filterByCategory(Iterable<Parameter> entities) {
        Map<ParameterType, List<Parameter>> mapParameter = new HashMap<>();
        List<Parameter> listTemp = new ArrayList<>();
        ParameterType api = null;
        for(Parameter parameter : entities){
            if(!mapParameter.containsKey(parameter.getCategory())){
                if(!listTemp.isEmpty() && api != null){
                    mapParameter.put(api, listTemp);
                }
                api = parameter.getCategory();
                listTemp= new ArrayList<>();
            }
            listTemp.add(parameter);
        }
        
        return this.toResource(mapParameter);
    }

    public List<ParameterByCategoryResource> toResource(Map<ParameterType, List<Parameter>> mapParameters) {
        List<ParameterByCategoryResource> list = new ArrayList<>();
        for (Map.Entry<ParameterType, List<Parameter>> entry : mapParameters.entrySet()) {
		ParameterByCategoryResource param = new ParameterByCategoryResource();
                param.setCategory(entry.getKey());
                param.setParameter(this.convert(entry.getValue()));
                list.add(param);
	}
        
        return list;
    }

    private List<ParameterResource> convert(List<Parameter> listParam){
        List<ParameterResource> list = new ArrayList<>();
        for(Parameter param : listParam){
            list.add(new ParameterResource(param));
        }
        return list;
    }
}
