/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.swimlane;

import java.sql.Timestamp;
import org.co2.kanban.repository.swimlane.Swimlane;
import org.co2.kanban.rest.IdentifiableResourceSupport;

/**
 *
 * @author ben
 */
public class SwimlaneResource extends IdentifiableResourceSupport<Swimlane> {


    private int taskCount = 0;

    public SwimlaneResource(Swimlane swimlane) {
        super(swimlane);
    }
    
    public String getName() {
        return this.getBean().getName();
    }

    public Long getPosition() {
        return this.getBean().getPosition();
    }

    public int getTaskCount() {
        return taskCount;
    }

    public void setTaskCount(int taskCount) {
        this.taskCount = taskCount;
    }

    public Timestamp getEndPlanned() {
        return this.getBean().getEndPlanned();
    }
    
}
