/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.project.reporting;

import org.co2.kanban.project.swimlane.Swimlane;
import java.util.List;

/**
 *
 * @author ben
 */
public class SwimlaneReport extends StateReport{
    
    private String swimlane;
    
    public String getSwimlane() {
        return swimlane;
    }

    public void setSwimlane(String swimlane) {
        this.swimlane = swimlane;
    }

}
