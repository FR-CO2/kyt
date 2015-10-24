/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.state;

import org.springframework.hateoas.ResourceSupport;

/**
 *
 * @author ben
 */
public class StateResource extends ResourceSupport {

    private String name;

    private int taskCount = 0;

    private Long position;

    private Boolean kanbanHide = Boolean.FALSE;

    private Boolean closeState = Boolean.FALSE;

    public int getTaskCount() {
        return taskCount;
    }

    public void setTaskCount(int taskCount) {
        this.taskCount = taskCount;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getPosition() {
        return position;
    }

    public void setPosition(Long position) {
        this.position = position;
    }

    public Boolean getKanbanHide() {
        return kanbanHide;
    }

    public void setKanbanHide(Boolean kanbanHide) {
        this.kanbanHide = kanbanHide;
    }

    public Boolean getCloseState() {
        return closeState;
    }

    public void setCloseState(Boolean closeState) {
        this.closeState = closeState;
    }
    
    
}
