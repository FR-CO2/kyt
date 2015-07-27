/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.cgi.fgdc.bdx.kanban.timesheet;

/**
 *
 * @author ben
 */
public class TimesheetForm {
    
    private Long taskId;
    
    private Integer timeSpend;
    
    private Integer timeRemains;

    public Long getTaskId() {
        return taskId;
    }

    public void setTaskId(Long taskId) {
        this.taskId = taskId;
    }

    public Integer getTimeSpend() {
        return timeSpend;
    }

    public void setTimeSpend(Integer timeSpend) {
        this.timeSpend = timeSpend;
    }

    public Integer getTimeRemains() {
        return timeRemains;
    }

    public void setTimeRemains(Integer timeRemains) {
        this.timeRemains = timeRemains;
    }
    


}
