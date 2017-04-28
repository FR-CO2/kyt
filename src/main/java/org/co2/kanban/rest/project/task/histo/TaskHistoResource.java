/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.task.histo;

import org.co2.kanban.business.project.task.history.TaskHistoRest;
import org.co2.kanban.business.project.type.action.EnumAction;
import org.co2.kanban.rest.IdentifiableResourceSupport;

import java.sql.Timestamp;

/**
 *
 * @author ben
 */
public class TaskHistoResource extends IdentifiableResourceSupport<TaskHistoRest> {

    public TaskHistoResource(TaskHistoRest task) {
        super(task);
    }

    public String getCategoryName() {
        return this.getBean().getCategoryName();
    }
    public Long getCategoryId() {
        return this.getBean().getCategoryId();
    }

    public String getStateName() {
        return this.getBean().getStateName();
    }
    public Long getStateId() {
        return this.getBean().getStateId();
    }

    public String getProjectName() {
        return this.getBean().getProjectName();
    }
    public Long getProjectId() {
        return this.getBean().getProjectId();
    }

    public String getSwimlaneName() {
        return this.getBean().getSwinlameName();
    }
    public Long getSwimlaneId() {
        return this.getBean().getSwinlameId();
    }

    public String getUserNameWriter() {
        return this.getBean().getUsernameWriter();
    }
    public Long getUserIdWriter() {
        return this.getBean().getUserIdWriter();
    }

    public Long getVersionId() {
        return this.getBean().getVersionId();
    }
    public String getActionName() {
        return EnumAction.DELETED.getActionFromVal(this.getBean().getActionValue()).getName();
    }

    public Timestamp getWritingDate() {
        return this.getBean().getDateModif();
    }
    public Float getTotalAllocation(){return this.getBean().getTotalAllocation();}
}
