/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.cgi.fgdc.bdx.kanban.project.reporting;

import com.cgi.fgdc.bdx.kanban.project.state.State;
import com.cgi.fgdc.bdx.kanban.project.swimlane.Swimlane;
import java.util.List;
import java.util.Map;

/**
 *
 * @author ben
 */
public class SwimlaneReport {
    
    private Swimlane swimlane;
    
    private List<StateReport> statesReport;

    public Swimlane getSwimlane() {
        return swimlane;
    }

    public void setSwimlane(Swimlane swimlane) {
        this.swimlane = swimlane;
    }

    public List<StateReport> getStatesReport() {
        return statesReport;
    }

    public void setStatesReport(List<StateReport> statesReport) {
        this.statesReport = statesReport;
    }
    
}
