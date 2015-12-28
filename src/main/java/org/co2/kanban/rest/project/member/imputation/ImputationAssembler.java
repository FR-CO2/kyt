/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.member.imputation;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.GregorianCalendar;
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

    public ImputationResource toResources(Timestamp start, Timestamp end, Iterable<Allocation> allocations) {
        ImputationResource imputations = new ImputationResource();

        Map<Long, Float> allocationDates = new HashMap<>();
        Map<Long, ImputationDetailResource> imputationDetails = new HashMap<>();
        List<Timestamp> times = new ArrayList<>();
        GregorianCalendar cal = new GregorianCalendar();
        cal.setTimeInMillis(start.getTime());
        while (cal.getTime().before(end)) {
            Timestamp time = new Timestamp(cal.getTimeInMillis());
            times.add(time);
            allocationDates.put(time.getTime(), 0F);
            cal.add(GregorianCalendar.DAY_OF_MONTH, 1);
        }
        for (Allocation allocation : allocations) {
            Float timeSpent = allocationDates.get(allocation.getAllocationDate().getTime());
            allocationDates.put(allocation.getAllocationDate().getTime(), timeSpent + allocation.getTimeSpent());

            if (!imputationDetails.containsKey(allocation.getTask().getId())) {
                ImputationDetailResource detail = new ImputationDetailResource(times, allocation.getTask().getName(),
                        allocation.getTask().getId());
                imputationDetails.put(allocation.getTask().getId(), detail);
            }
            imputationDetails.get(allocation.getTask().getId()).getImputations().put(allocation.getAllocationDate().getTime(), allocation.getTimeSpent());
        }

        imputations.setImputations(allocationDates);
        imputations.setDetails(imputationDetails.values());

        return imputations;
    }

}
