/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.project.task.allocation;

import java.util.Comparator;

/**
 *
 * @author granels
 */
public class AllocationDateComparator implements Comparator<Allocation>{

    @Override
    public int compare(Allocation o1, Allocation o2) {
        if (o2.getAllocationDate() == null || o1.getAllocationDate() == null ) {
            return 0;
        } 
        return  o1.getAllocationDate().compareTo(o2.getAllocationDate());
    }
    
    
}
