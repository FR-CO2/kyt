/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.state;

import org.co2.kanban.repository.state.State;
import org.co2.kanban.rest.IdentifiableResourceSupport;

/**
 *
 * @author ben
 */
public class StateResource extends IdentifiableResourceSupport<State> {

    private Integer taskCount = 0;
    
    public StateResource(State state) {
        super(state);
    }
    

    public Integer getTaskCount() {
        return taskCount;
    }

    public void setTaskCount(Integer taskCount) {
        this.taskCount = taskCount;
    }

    public String getName() {
        return this.getBean().getName();
    }

    public Long getPosition() {
        return this.getBean().getPosition();
    }

    public Boolean getKanbanHide() {
        return this.getBean().getKanbanHide();
    }

    public Boolean getCloseState() {
        return this.getBean().getCloseState();
    }
}
