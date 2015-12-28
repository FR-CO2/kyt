/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.member.imputation;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.co2.kanban.repository.allocation.Allocation;
import org.springframework.stereotype.Component;

/**
 *
 * @author ben
 */
@Component
public class ImputationAssembler {
    
    public ImputationResource toResource(Timestamp date, Iterable<Allocation> allocations) {
        Float timeSpent = 0F;
        List<ImputationDetailResource> details = new ArrayList<>();
        for (Allocation allocation : allocations) {
            ImputationDetailResource detail = new ImputationDetailResource(allocation.getTask().getName(),allocation.getTask().getId(), allocation.getTimeSpent());
            timeSpent += detail.getTimeSpent();
            details.add(detail);
        }
        ImputationResource resource = new ImputationResource(date, timeSpent);
        resource.getDetails().addAll(details);
        return resource;
        
    }
    
    public Iterable<ImputationResource> toResources(Iterable<Allocation> allocations) {
        List<ImputationResource> imputations = new ArrayList<>();
        Map<Timestamp, List<Allocation>> allocationsGrouped = new HashMap<>();
        for (Allocation allocation : allocations) {
            if (!allocationsGrouped.containsKey(allocation.getAllocationDate())) {
               allocationsGrouped.put(allocation.getAllocationDate(), new ArrayList<Allocation>());
            }
            allocationsGrouped.get(allocation.getAllocationDate()).add(allocation);
        }
        for(Map.Entry<Timestamp, List<Allocation>> entry : allocationsGrouped.entrySet()) {
            imputations.add(toResource(entry.getKey(), entry.getValue()));
        }
        return imputations;
    }
    
}
