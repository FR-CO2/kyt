/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.cgi.fgdc.bdx.kanban.project.reporting;

import com.cgi.fgdc.bdx.kanban.project.state.State;

/**
 *
 * @author ben
 */
public class StateReport {
    
    private State state;
    
    private Long nbTask;

    public State getState() {
        return state;
    }

    public void setState(State state) {
        this.state = state;
    }

    public Long getNbTask() {
        return nbTask;
    }

    public void setNbTask(Long nbTask) {
        this.nbTask = nbTask;
    }
    
}
