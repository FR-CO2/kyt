/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.task.allocation;

import java.sql.Timestamp;
import org.co2.kanban.repository.allocation.Allocation;
import org.co2.kanban.rest.IdentifiableResourceSupport;

/**
 *
 * @author ben
 */
public class AllocationResource extends IdentifiableResourceSupport<Allocation> {

    public AllocationResource(Allocation bean) {
        super(bean);
    }

    public String getUsername() {
        return this.getBean().getMember().getUser().getUsername();
    }

    public Timestamp getDate() {
        return this.getBean().getAllocationDate();
    }

    public Float getTimeSpent() {
        return this.getBean().getTimeSpent();
    }

    public Float getTimeRemains() {
        return this.getBean().getTimeRemains();
    }
}
