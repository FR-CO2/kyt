/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.cgi.fgdc.bdx.kanban.project.reporting;

import com.cgi.fgdc.bdx.kanban.project.security.Member;

/**
 *
 * @author ben
 */
public class AssigneeReport {
 
    private String assignee;
    
    private Long nbTasks;

    public String getAssignee() {
        return assignee;
    }

    public void setAssignee(String assignee) {
        this.assignee = assignee;
    }

    public Long getNbTasks() {
        return nbTasks;
    }

    public void setNbTasks(Long nbTasks) {
        this.nbTasks = nbTasks;
    }
 
    
}
